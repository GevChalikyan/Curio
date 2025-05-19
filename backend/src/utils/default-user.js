const { query } = require("../db/db");
const bcrypt = require("bcryptjs");

async function createDefaultUser() {
  try {
    const username = process.env.DEFAULT_USER_NAME;
    const password = process.env.DEFAULT_USER_PASS;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
      [ username, password_hash ]
    );

    const user = result.rows[0];

    console.log("Test User Created:");
    console.log("Username: ", user.username);
    console.log("Password Hash: ", user.password_hash);

  } catch (error) {
    console.error("Error Creating User: ", error);
    throw error;
  }
}

module.exports = createDefaultUser;