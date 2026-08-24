import { db } from "../config/db.js";

const createUser = async (
    full_name,
    email,
    password,
    phone_number
) => {
    const [result] = await db.query(`
        INSERT INTO users (full_name, email, password, phone) VALUES (?, ?, ?, ?)
    `, [full_name, email, password, phone_number]);
    return result;
};

const getUserByEmail = async (email) => {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
}

const getUserById = async (id) =>{
    const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0];
}

export default {
    createUser,
    getUserByEmail,
    getUserById
};