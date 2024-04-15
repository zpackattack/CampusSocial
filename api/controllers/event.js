import { db } from "../connect.js";

export const createEvent = (req, res) => {
    const checkOverlapQuery = `
    SELECT e.eventID
        FROM events e
        JOIN locations l ON e.locationID = l.locationID
        WHERE e.time = ? AND e.date = ? AND l.longitude = ? AND l.latitude = ?;
`;

// Execute the query to check for overlapping events
db.query(checkOverlapQuery, [ req.body.time, req.body.date, req.body.longitude, req.body.latitude], (err, overlapData) => {
    if (err) {
        // Handle any database errors
        return res.status(500).json({ error: "Database error" });
    }

    // If there is an overlapping event, return an error message
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

            // Check if rsoID is not null before executing the query
            if (req.body.rsoID) {
                const rsoEventQuery = `
                    INSERT INTO eventrsomembers (eventID, rsoID)
                    VALUES (?, ?)
                `;

                db.query(rsoEventQuery, [eventID, req.body.rsoID], (error) => {
                    if (error) {
                        console.error('Error linking event to RSO: ' + error);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }

                    res.status(201).json({ message: 'Event created and linked to RSO' });
                });
            } else {
                res.status(201).json({ message: 'Event created' });
            }
        });
    });
});
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

    // SQL query to retrieve events and posts based on the criteria
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

    // SQL query to retrieve events and posts based on the criteria
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
        time,
        date,
        locationID,
        contactPhone,
        contactEmail,
        eventType,
    } = req.body;

    // SQL query to update the event
    const query = `
        UPDATE events
        SET
            name = ?,
            category = ?,
            descriptions = ?,
            time = ?,
            date = ?,
            locationID = ?,
            contactPhone = ?,
            contactEmail = ?,
            eventType = ?
        WHERE eventID = ?
    `;

    db.query(query, [name, category, description, time, date, locationID, contactPhone, contactEmail, eventType, eventID], (error, results) => {
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

    // SQL query to update the event
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
        SELECT eventID
        FROM eventrsomembers
        WHERE rsoID = ?
    `;

    db.query(query, [rsoID], (error, results) => {
        if (error) {
            console.error('Error executing MySQL query: ' + error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Extract eventIDs from results
        const eventIDs = results.map(result => result.eventID);
        console.log(results);
        if(results.lenght > 0){
        // SQL query to get events using the extracted eventIDs
        const eventQuery = `
            SELECT *
            FROM events
            WHERE eventID IN (?)
        `;

        db.query(eventQuery, [eventIDs], (eventError, eventResults) => {
            if (eventError) {
                console.error('Error executing MySQL query: ' + eventError);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            res.json(eventResults);
        });
    }
    else{
        res.json(results);
    }
    });
};
