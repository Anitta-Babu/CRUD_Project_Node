import pool from "../config/db.js";

const createUserTable = async () => {
  const queryText = `
  CREATE TABLE  IF NOT EXISTs patient(
  id SERIAL PRIMARY KEY ,
  name VARCHAR(100) NOT NULL,
   email VARCHAR(100) UNIQUE NOT NULL,
   created_at TIMESTAMP DEFAULT NOW()
)`;
  try {
    pool.query(queryText);
    console.log("Patient table created if not exists");
  } catch (error) {
    console.log("Error creating Patient table : ", error);
  }
};

export default createUserTable;
