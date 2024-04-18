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

export const getTotalCommentCount = (req, res) => {
  const { eventID } = req.params;

 
  const query = `
      SELECT COUNT(*) AS totalCommentCount
      FROM EventComments
      WHERE EventID = ?
  `;

  db.query(query, [eventID], (error, results) => {
      if (error) {
          console.error('Error executing MySQL query: ' + error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      const totalCommentCount = results[0].totalCommentCount;

      res.status(200).json({ totalCommentCount });
  });
}

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
  
    const commentId = req.query.commentID; 
    const userId = req.query.userID; 
    console.log(userId);
    const q = "DELETE FROM eventcomments WHERE `commentID` = ? AND `userId` = ?";

    db.query(q, [commentId, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
};


export const editComment = (req, res) => {
  
  const { commentID, userID, rating, comment } = req.body;

  const query = `
      UPDATE eventcomments
      SET comment = ?, rating = ?
      WHERE commentID = ? AND userID = ?
  `;

  db.query(query, [comment, rating, commentID, userID], (error, results) => {
      if (error) {
          console.error('Error executing MySQL query: ' + error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      if (results.affectedRows === 0) {

          res.status(404).json({ error: 'Comment not found' });
          return;
      }

      res.status(200).json({ message: 'Comment updated successfully' });
  });

}

export const getAverageRating = (req, res) => {
  const { eventID } = req.params;


  const query = `
      SELECT AVG(Rating) AS averageRating
      FROM EventComments
      WHERE EventID = ?
  `;

  db.query(query, [eventID], (error, results) => {
      if (error) {
          console.error('Error executing MySQL query: ' + error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      const averageRating = results[0].averageRating || 0; 
      res.status(200).json({ averageRating });
  });
}