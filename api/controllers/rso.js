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
        ];

        const rsoQuery =
            "INSERT INTO rsos (name, adminID, universityID) VALUES (?)";

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
    const userID = req.body.userID;

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

export const getUniversityRSOs = (req, res) => {
    const universityID = req.body.universityID;

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