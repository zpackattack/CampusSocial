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

export const getUniversityID = (req, res) => {
  const universityID = req.params.universityID; // Get the university name from query parameters

  // Query to select universities with names similar to the provided name
  const query = 'SELECT * FROM universities WHERE universityID = ?';

  // Execute the query with the wildcard appended to the name
  db.query(query, [universityID], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No universities found' });
    }

    res.json(results); // Return the results
  });
};

export const createUniversity = (req, res) => {
  const { name, location, description, numberOfStudents, pictures, extension } = req.body;

  // SQL query to insert new university into the database
  const query = `
      INSERT INTO Universities (name, location, Description, numberOfStudents, pictures, ext)
      VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, location, description, numberOfStudents, pictures, extension], (error, results) => {
      if (error) {
          console.error('Error executing MySQL query: ' + error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      res.status(201).json({ message: 'University created successfully' });
  });
}

export const editUniversity = (req, res) => {
  const { universityID, name, location, description, numberOfStudents, pictures, extension } = req.body;

  // SQL query to update university information
  const query = `
      UPDATE Universities
      SET
          Name = ?,
          Location = ?,
          Description = ?,
          NumberOfStudents = ?,
          Pictures = ?,
          ext = ?
      WHERE UniversityID = ?
  `;

  db.query(query, [name, location, description, numberOfStudents, pictures, extension, universityID], (error, results) => {
      if (error) {
          console.error('Error executing MySQL query: ' + error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }

      res.status(200).json({ message: 'University updated successfully' });
  });
}
