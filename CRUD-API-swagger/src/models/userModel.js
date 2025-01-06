import pool from "../config/db.js";

export const getAllUserService = async () => {
  const result = await pool.query("SELECT * FROM patient");
  return result.rows;
};
export const getUserIdService = async (id) => {
  const result = await pool.query("SELECT * FROM patient where id=$1", [id]);
  return result.rows[0];
};
export const createUserService = async (name, email) => {
  const result = await pool.query(
    "INSERT INTO patient (name,email) VALUES ($1,$2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
};
export const updateUserService = async (id, name, email) => {
  const result = await pool.query(
    "UPDATE patient SET name=$1,email=$2 WHERE id=$3 RETURNING *",
    [name, email, id]
  );
  return result.rows[0];
};
export const deleteUserService = async (id) => {
  const result = await pool.query(
    "DELETE FROM patient WHERE id=$1 RETURNING *",
    [id]
  );
  return result.rows[0];
};