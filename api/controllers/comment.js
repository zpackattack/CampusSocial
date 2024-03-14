import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.userID AS userID, name FROM eventcomments AS c JOIN users AS u ON (u.userID = c.userID)
    WHERE c.eventID = ?
    `;

  db.query(q, [req.query.eventID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    console.log( userInfo.userID);
    const q = "INSERT INTO eventcomments(`eventID`, `userID`, `comment`, `rating`) VALUES (?)";
    const values = [
      req.body.eventID,
      userInfo.userID,
      req.body.comment,
      req.body.rating
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.commentID;
    const userId = req.body.userID;
    const q = "DELETE FROM eventcomments WHERE `commentID` = ? AND `userId` = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};


export const editComment = (req, res) => {
  
  const { commentID, rating, comment } = req.body;
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
  // SQL query to update the comment with the new content
  const userID = req.body.userID;
  const query = `
      UPDATE eventcomments
      SET comment = ?, rating = ?
      WHERE commentID = ? AND userId = ?
  `;

  db.query(query, [comment, rating, commentID, userID], (error, results) => {
      if (error) {
          console.error('Error executing MySQL query: ' + error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      if (results.affectedRows === 0) {
          // No comment was updated (commentID not found)
          res.status(404).json({ error: 'Comment not found' });
          return;
      }

      // Comment updated successfully
      res.status(200).json({ message: 'Comment updated successfully' });
  });
});
}