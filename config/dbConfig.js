import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "G3EvForum",
});

db.connect((err) => {
  if (err) {
    console.log(`ERROR connecting ... ${err.message}`);
  } else {
    console.log(`Database Connection Established !`);
  }
});

export default db;
