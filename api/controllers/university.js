import { db } from "../connect.js";
import bcrypt from "bcryptjs";

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
  const { name, locationID, description, numberOfStudents, pictures, extension, instagram, twitter, facebook, logo, website, adminName, adminEmail, adminPassword} = req.body;
  const q =
        "INSERT INTO Users (Username, Password, UserType, UniversityID, name) VALUE (?)";

      const values = [
        adminEmail,
        adminPassword,
        3,
        1,
        adminName,
      ];
      console.log(req.body);

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        const adminID = data.insertId;

      const query = `
          INSERT INTO Universities (name, locationID, Description, numberOfStudents, pictures, ext, adminID, instagram, twitter, facebook, logo, website)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(query, [name, locationID, description, numberOfStudents, pictures, extension, adminID, instagram, twitter, facebook, logo, website], (error, results) => {
          if (error) {
              console.error('Error executing MySQL query: ' + error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }

          
          const universityID = results.insertId;
          const qu =
          "UPDATE users SET universityID=? WHERE userID=? ";

          db.query(qu, [universityID, adminID], (error, res) => {
            if (error) {
                console.error('Error executing MySQL query: ' + error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            res.status(201).json({ message: 'University created successfully' });
      });
    });
    });
}

export const createUniversityRequest = (req, res) => {
  const { name, locationName, longitude, latitude, description, numberOfStudents, pictures, extension, instagram, twitter, facebook, logo, website, adminName, adminEmail, adminPassword } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(adminPassword, salt);

  const q = `
            INSERT INTO locations (name, longitude, latitude)
            VALUES (?)
        `;
    const values = [
        locationName,
        longitude,
        latitude,
    ];

    db.query(q, [values], (error, locationRes) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const locationID = locationRes.insertId;

      const query = `
      INSERT INTO universityrequest (name, locationID, Description, numberOfStudents, pictures, ext, instagram, twitter, facebook, logo, website, status, adminName, adminEmail, adminPassword)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(query, [name, locationID, description, numberOfStudents, pictures, extension, instagram, twitter, facebook, logo, website, 0, adminName, adminEmail, hashedPassword], (error, results) => {
          if (error) {
              console.error('Error executing MySQL query: ' + error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }

          res.status(201).json({ message: 'University Request created successfully' });
      });
    });
}

export const setUniversityRequest = (req, res) => {
  const { requestID, status } = req.body;
  console.log(requestID + ' ' + status);

  const query = `
  UPDATE universityrequest
    SET status = ?
    WHERE universityRequestID = ?
  `;

  db.query(query, [status, requestID], (error, results) => {
    if (error) {
      console.error('Error updating university request status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'University request not found' });
    }

    res.status(200).json({ message: 'University request status updated successfully' });
  });
}

export const getUniversityRequests = (req, res) => {
  const status  = req.params.status;

  // SQL query to insert new university into the database
  const query = `
    SELECT *
    FROM universityrequest
    WHERE status = ?
  `;

  db.query(query, [status], (error, results) => {
    if (error) {
      console.error('Error fetching university requests:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(results);
  });
}

export const editUniversity = (req, res) => {
  const { universityID, name, location, description, numberOfStudents, pictures, extension, instagram, twitter, facebook, logo, website } = req.body;

  // SQL query to update university information
  const query = `
      UPDATE Universities
      SET
          Name = ?,
          LocationID = ?,
          Description = ?,
          NumberOfStudents = ?,
          Pictures = ?,
          ext = ?,
          instagram = ?, 
          twitter = ?, 
          facebook = ?, 
          logo = ?, 
          website = ?,
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
