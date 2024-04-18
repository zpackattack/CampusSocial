import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //CHECK USER IF EXISTS
  console.log(req.body);

  const q = "SELECT * FROM users WHERE username = '" + req.body.username + "'";
  console.log(q);

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const extension = req.body.username.substring(req.body.username.indexOf("@") + 1, req.body.username.lastIndexOf("."));

    const uni = "SELECT * FROM universities WHERE ext = '" + extension + "'";
    console.log(uni);
    db.query(uni, [extension], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length == 0) return res.status(409).json("Email not from regisetered college!");
      const q =
        "INSERT INTO Users (Username, Password, UserType, UniversityID, name) VALUE (?)";

      const values = [
        req.body.username,
        hashedPassword,
        req.body.userType,
        req.body.universityID,
        req.body.name,
      ];
      console.log(req.body);

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = '" + req.body.username + "'";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ userID: data[0].userID }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken",{
    secure:true,
    sameSite:"none"
  }).status(200).json("User has been logged out.")
};
