import mysql from "mysql"

export const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"N1tr@us33",
  database:"app"
})

/*export const db = mysql.createConnection({
  host:"campussocial-do-user-12304672-0.c.db.ondigitalocean.com",
  user:"doadmin",
  password:"AVNS_w4DN7xeSQ6B9-ZMKnqx",
  port:25060,
  database:"app"
})*/