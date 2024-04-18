import { db } from "../connect.js";

export const createEvent = (req, res) => {
    const checkOverlapQuery = `
    SELECT e.eventID
        FROM events e
        JOIN locations l ON e.locationID = l.locationID
        WHERE e.time = ? AND e.date = ? AND l.longitude = ? AND l.latitude = ?;
`;


db.query(checkOverlapQuery, [ req.body.time, req.body.date, req.body.longitude, req.body.latitude], (err, overlapData) => {
    if (err) {
        
        return res.status(500).json({ error: "Database error" });
    }

  
    if (overlapData.length > 0) {
        return res.status(409).json({ error: "An event is already scheduled at this time and location." });
    }
    const q = `
            INSERT INTO locations (name, longitude, latitude)
            VALUES (?)
        `;
    const values = [
        req.body.locationName,
        req.body.longitude,
        req.body.latitude,
    ];

    db.query(q, [values], (error, locationRes) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const locationID = locationRes.insertId;

        const query = `
            INSERT INTO events (name, category, descriptions, time, date, locationID, contactPhone, contactEmail, eventType, status, posterID, rsoID, universityID)
            VALUES (?)
        `;

        const values1 = [
            req.body.name,
            req.body.category,
            req.body.description,
            req.body.time,
            req.body.date,
            locationID,
            req.body.contactPhone,
            req.body.contactEmail,
            req.body.eventType,
            req.body.status,
            req.body.posterID,
            req.body.rsoID,
            req.body.universityID
        ];

        db.query(query, [values1], (error, results) => {
            if (error) {
                console.error('Error executing MySQL query: ' + error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            const eventID = results.insertId;
            console.log(eventID + " " + req.body.rsoID);

  
            
            res.status(201).json({ message: 'Event created' });
        });
    });
});
}

export const createRSOEvent = (req, res) => {
    if(req.body.adminID == req.body.userID){
    const checkOverlapQuery = `
    SELECT e.eventID
        FROM events e
        JOIN locations l ON e.locationID = l.locationID
        WHERE e.time = ? AND e.date = ? AND l.longitude = ? AND l.latitude = ?;
`;


db.query(checkOverlapQuery, [ req.body.time, req.body.date, req.body.longitude, req.body.latitude], (err, overlapData) => {
    if (err) {
        
        return res.status(500).json({ error: "Database error" });
    }

  
    if (overlapData.length > 0) {
        return res.status(409).json({ error: "An event is already scheduled at this time and location." });
    }
    const q = `
            INSERT INTO locations (name, longitude, latitude)
            VALUES (?)
        `;
    const values = [
        req.body.locationName,
        req.body.longitude,
        req.body.latitude,
    ];

    db.query(q, [values], (error, locationRes) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const locationID = locationRes.insertId;

        const query = `
            INSERT INTO events (name, category, descriptions, time, date, locationID, contactPhone, contactEmail, eventType, status, posterID, rsoID, universityID)
            VALUES (?)
        `;

        const values1 = [
            req.body.name,
            req.body.category,
            req.body.description,
            req.body.time,
            req.body.date,
            locationID,
            req.body.contactPhone,
            req.body.contactEmail,
            req.body.eventType,
            req.body.status,
            req.body.posterID,
            req.body.rsoID,
            req.body.universityID
        ];

        db.query(query, [values1], (error, results) => {
            if (error) {
                console.error('Error executing MySQL query: ' + error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            const eventID = results.insertId;
            console.log(eventID + " " + req.body.rsoID);

  
            res.status(201).json({ message: 'Event created' });
            
        });
    });
});
    }else{
        return res.status(409).json({ error: "You are not the admin of this rso!" });
    }
}

export const getPublicEventsApproval = (req, res) => {
    const {status} = req.params;
    const query = `
    SELECT *
    FROM Events
    WHERE EventType = 'Public' AND Status = ?
    `
    db.query(query, [status], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
}

export const getEvents = (req, res) => {
    const { userID } = req.query;

    const query = `
        SELECT *
        FROM Events
        WHERE EventType = 'Public' AND status = 2
        UNION
        SELECT E.*
        FROM Events E
        WHERE E.EventType = 'Private' AND E.UniversityID = (
            SELECT UniversityID FROM Users WHERE UserID = ?
        )
        UNION
        SELECT E.*
        FROM Events E
        JOIN rsomembers U ON E.rsoID = U.rsoID
        WHERE E.EventType = 'RSO' AND U.UserID = ?
        ORDER BY date ASC;
    `;

    db.query(query, [userID, userID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
}

export const getUserEvents = (req, res) => {
    const { userID } = req.query;

    const query = `
        SELECT *
        FROM Events
        WHERE posterID = ? AND status = 2
    `;

    db.query(query, [userID, userID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
}

export const editEvent = (req, res) => {
    const {
        eventID,
        name,
        category,
        description,
        contactPhone,
        contactEmail,
        eventType,
        date,
        time,
    } = req.body;

    const query = `
        UPDATE events
        SET
            name = ?,
            category = ?,
            descriptions = ?,
            contactPhone = ?,
            contactEmail = ?,
            eventType = ?,
            date = ?,
            time = ?
        WHERE eventID = ?
    `;

    db.query(query, [name, category, description, contactPhone, contactEmail, eventType,  date, time, eventID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }


        res.status(200).json({ message: 'Event updated successfully' });
    });
}

export const setEvent = (req, res) => {
    const {
        eventID,
        status
    } = req.body;


    const query = `
        UPDATE events
        SET
            status = ?
        WHERE eventID = ?
    `;

    db.query(query, [status, eventID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }


        res.status(200).json({ message: 'Event updated successfully' });
    });
}

export const deleteEvent = (req, res) => {
    const eventID = req.params.eventID;

    const query = `
    DELETE FROM events
    WHERE eventID = ?
    `;

    db.query(query, [eventID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else if (results.affectedRows === 0) {

            res.status(404).json({ error: 'Event not found' });
        } else {

            res.json({ message: 'Event deleted successfully' });
        }
    });
}

export const getLocation = (req, res) => {
    const q = `SELECT l.* FROM locations AS l WHERE l.locationID = ?
    `;

  db.query(q, [req.query.locationID], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}


export const editLocation = (req, res) => {
    const { locationID, name, longitude, latitude } = req.body;

    // SQL query to update the location
    const query = `
        UPDATE locations
        SET
            name = ?,
            longitude = ?,
            latitude = ?
        WHERE locationID = ?
    `;

    db.query(query, [name, longitude, latitude, locationID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        res.status(200).json({ message: 'Location updated successfully' });
    });
}

export const getRSOEvents = (req, res) => {
    const { rsoID } = req.params;

    // SQL query to get eventIDs associated with the given RSO
    const query = `
        SELECT *
        FROM events
        WHERE rsoID = ?
        ORDER BY date ASC;
    `;

    db.query(query, [rsoID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });

};
