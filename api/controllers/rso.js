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

            const rsoID = rsoData.insertId; // Assuming 'insertId' gives the ID of the newly inserted RSO
            const memberValues = [
                req.body.adminID, // adminID
                rsoID, // rsoID
            ];

            const memberQuery =
                "INSERT INTO rsomembers (userID, rsoID) VALUES (?)";

            db.query(memberQuery, [memberValues], (err, memberData) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("RSO and admin member created.");
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

    // SQL query to retrieve RSOs that the user is a part of
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
        SELECT *
        FROM rsos
        WHERE universityID = ?
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
    const universityID = req.query.universityID;
    const userID = req.query.userID;

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