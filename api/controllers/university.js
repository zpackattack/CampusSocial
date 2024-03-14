import { db } from "../connect.js";

export const getUniversity = (req, res) => {
  const name = req.query.name; // Get the university name from query parameters

  // Query to select universities with names similar to the provided name
  const query = 'SELECT * FROM universities WHERE name LIKE ?';

  // Execute the query with the wildcard appended to the name
  db.query(query, [`%${name}%`], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No similar universities found' });
    }

    res.json(results); // Return the results
  });
};

