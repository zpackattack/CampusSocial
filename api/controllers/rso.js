import { db } from "../connect.js";
import jwt from "jsonwebtoken";


export const createRSO = (req, res) => {
    const q = "SELECT * FROM rsos WHERE name = ?";
    console.log(q);

    db.query(q, [req.body.name], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("RSO already exists!");

        const rsoValues = [
            req.body.name,
            req.body.adminID,
            req.body.universityID,
            req.body.profilePicture,
            req.body.rsoPicture,
        ];

        const rsoQuery =
            "INSERT INTO rsos (name, adminID, universityID, profilePicture, rsoPicture) VALUES (?)";

        db.query(rsoQuery, [rsoValues], (err, rsoData) => {
            if (err) return res.status(500).json(err);

            const rsoID = rsoData.insertId; 
            const memberValues = [
                req.body.adminID, 
                rsoID, 
            ];

            const memberQuery =
                "INSERT INTO rsomembers (userID, rsoID) VALUES (?)";

            db.query(memberQuery, [memberValues], (err, memberData) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json({ message: "RSO and admin member created.", rsoID });
            });
        });
    });
};

export const addMembers = (req, res) => {
    const q =
    "INSERT INTO rsomembers (userID, rsoID) VALUE (?)";

    const values = [
    req.body.userID,
    req.body.rsoID,
    ];
    console.log(req.body);

    db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("RSO member added.");
    });
};


export const getUserRSOs = (req, res) => {
    const userID = req.params.userID;

    const query = `
        SELECT R.*
        FROM rsos R
        JOIN rsomembers M ON R.rsoID = M.rsoID
        WHERE M.userID = ?
    `;

    db.query(query, [userID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const rsos = results.map(result => result.name);
        res.json(results);
        
    });
}

export const getAdminRSOs = (req, res) => {
    const adminID = req.params.adminID;
    console.log(req.params.adminID);

    const query = `
        SELECT R.*
        FROM rsos R
        WHERE R.adminID = ?
    `;

    db.query(query, [adminID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const rsos = results.map(result => result.name);
        res.json(results);
        
    });
}

export const getRSO = (req, res) => {
    const rsoID = req.params.rsoID;

    // SQL query to retrieve RSOs that the user is a part of
    const query = `
        SELECT R.*
        FROM rsos R
        WHERE R.rsoID = ?
    `;

    db.query(query, [rsoID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const rsos = results.map(result => result.name);
        res.json(results);
        
    });
}

export const getUniversityRSOs = (req, res) => {
    const universityID = req.params.universityID;

    // SQL query to retrieve RSOs that the user is a part of
    const query = `
      SELECT r.*, COUNT(m.userID) AS memberCount
      FROM rsos AS r
      LEFT JOIN rsomembers AS m ON r.rsoID = m.rsoID
      WHERE r.universityID = ?
      GROUP BY r.rsoID
      ORDER BY memberCount DESC
      LIMIT 15
    `;

    db.query(query, [universityID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const rsos = results.map(result => result.name);
        res.json(results);
        
    });
}

export const getUniversityRSOsAll = (req, res) => {
    const universityID = req.params.universityID;

    // SQL query to retrieve RSOs that the user is a part of
    const query = `
      SELECT r.*
      FROM rsos AS r
      WHERE r.universityID = ?
    `;

    db.query(query, [universityID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const rsos = results.map(result => result.name);
        res.json(results);
        
    });
}


export const getUniversityRSOsNotMember = (req, res) => {
    const { universityID, userID } = req.params;


    // SQL query to retrieve RSOs that the user is not a part of
    const query = `
        SELECT *
        FROM rsos
        WHERE universityID = ?
            AND rsoID NOT IN (
                SELECT rsoID
                FROM rsomembers
                WHERE userID = ?
            )
    `;

    db.query(query, [universityID, userID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
};

export const checkUserInRSO = (req, res) => {
    const { userID, rsoID } = req.params;

    // SQL query to check if the user is a member of the RSO
    const query = `
        SELECT COUNT(*) AS count
        FROM rsomembers
        WHERE userID = ?
            AND rsoID = ?
    `;

    db.query(query, [userID, rsoID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const count = results[0].count;

        // Check if the count is greater than 0, indicating that the user is a member of the RSO
        const isMember = count > 0;

        res.json({ isMember });
    });
};

export const deleteMemberFromRSO = (req, res) => {
    const { userID, rsoID } = req.params;

    // SQL query to delete member from RSO
    const query = `
        DELETE FROM rsomembers
        WHERE userID = ? AND rsoID = ?
    `;

    db.query(query, [userID, rsoID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        // Check if any rows were affected
        if (results.affectedRows > 0) {
            res.json({ message: 'Member deleted from RSO successfully' });
        } else {
            res.status(404).json({ error: 'Member not found in RSO or already removed' });
        }
    });
};

export const countRSOMembers = (req, res) => {
    const { rsoID } = req.params;

    // SQL query to check if the user is a member of the RSO
    const query = `
        SELECT COUNT(*) AS count
        FROM rsomembers
        WHERE rsoID = ?
    `;

    db.query(query, [rsoID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const count = results[0].count;

        res.json({ count });
    });
};

export const updateRSO = (req, res) => {
    const { rsoID } = req.params;
    const updatedRSOData = req.body; // Updated RSO data to be provided in the request body

    // SQL query to update the RSO
    const query = `
        UPDATE rsos
        SET ?
        WHERE rsoID = ?
    `;

    db.query(query, [updatedRSOData, rsoID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        res.json({ message: 'RSO updated successfully' });
    });
};


export const createRSORequest = async (req, res) => {
    const q = "SELECT * FROM rsos WHERE name = ?";
    console.log(q);

    try {
        const data = await new Promise((resolve, reject) => {
            db.query(q, [req.body.name], (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        if (data.length) return res.status(409).json("RSO already exists!");

        const isMemberQuery = "SELECT userID FROM users WHERE username = ?";
        const addMembers = req.body.addMembers;
        let memberList = [];

        for (let i = 0; i < addMembers.length; i++) {
            const dataM = await new Promise((resolve, reject) => {
                db.query(isMemberQuery, [addMembers[i]], (err, dataM) => {
                    if (err) reject(err);
                    else resolve(dataM);
                });
            });

            if (dataM.length == 0) return res.status(409).json("User does not exist!");
            memberList.push(dataM[0].userID);
        }

        console.log(memberList);

        const rsoValues = [
            req.body.userID,
            req.body.name,
            req.body.status,
            req.body.description,
            req.body.universityID,
        ];

        const rsoQuery =
            "INSERT INTO rsorequests (userID, rsoName, status, description, universityID) VALUES (?)";

        const requestData = await new Promise((resolve, reject) => {
            db.query(rsoQuery, [rsoValues], (err, requestData) => {
                if (err) reject(err);
                else resolve(requestData);
            });
        });

        const memberQuery =
            "INSERT INTO rsorequestother (requestID, userID) VALUES ?";
        const requestID = requestData.insertId;

        const memberValues = memberList.map(memberID => [requestID, memberID]);

        await new Promise((resolve, reject) => {
            db.query(memberQuery, [memberValues], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        return res.status(200).json("RSO Request sent and members added");
    } catch (error) {
        return res.status(500).json(error);
    }
};


export const getUsersRSORequest = async (req, res) => {
    try {
        // Get the userID from request parameters
        const { userID } = req.params;
    
        // SQL query to fetch RSO requests sorted by status
        const query = `SELECT * FROM rsorequests WHERE userID = ? ORDER BY status;`;
    
        // Execute the query
        db.query(query, [userID], (error, results) => {
          if (error) {
            console.error('Error executing MySQL query:', error);
            return res.status(500).json({ error: 'Internal server error' });
          }
    
          // Send the sorted RSO requests in the response
          res.json(results);
        });
      } catch (error) {
        console.error('Error fetching RSO requests:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
};


export const getRSORequest = async (req, res) => {
    const { universityID } = req.params;
    console.log(universityID);
    const query = `
    SELECT 
      rsorequests.*, 
      users.name AS user_name, 
      users.username 
    FROM 
      rsorequests 
    INNER JOIN 
      users ON rsorequests.userID = users.userID
    WHERE 
      rsorequests.status = 0 AND rsorequests.universityID = ?
  `;

  db.query(query, [universityID], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  });
};

export const setRSORequestStatus = (req, res) => {
    console.log("TEST");
    const { requestID, status } = req.body;
    
  
    if (!requestID || !status) {
      return res.status(400).json({ error: 'RequestID and status are required' });
    }
  
    const query = `
    UPDATE rsorequests
    SET status = ?
    WHERE requestID = ?
    `;
  
    db.query(query, [status, requestID], (error, results) => {
      if (error) {
        console.error('Error executing MySQL query:', error);
        console.log(req.body);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'RSO request not found' });
      }
  
      res.json({ message: 'RSO request status updated successfully' });
    });
};


export const getRSORequestOthers = async (req, res) => {
    const { requestID } = req.params;

    const query = `
    SELECT Users.userID, Users.name, Users.username
    FROM rsorequestother
    JOIN Users ON rsorequestother.userID = Users.userID
    WHERE rsorequestother.requestID = ?
  `;

  db.query(query, [requestID], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    res.json(results);
  })
};