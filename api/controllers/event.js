import { db } from "../connect.js";

export const createEvent = (req, res) => {

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
            INSERT INTO events (name, category, descriptions, time, date, locationID, contactPhone, contactEmail, eventType)
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
            ];

        db.query(query, [values1], (error, results) => {
            if (error) {
                console.error('Error executing MySQL query: ' + error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            const eventID = results.insertId;

            
            const rsoEventQuery = `
                INSERT INTO EventRSOMembers (EventID, RSOID)
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
            
        });
    });
}