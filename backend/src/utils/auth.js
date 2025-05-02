const { query } = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const router = require('express').Router();






// Login Endpoint
router.post('/login', async (req, res) => {
  
  console.log('Login Accessed');

  try {

    const { username, password } = req.body



    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if(result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials'});
    }
    
    
    
    user = result.rows[0];
    
    const is_password_valid = await bcrypt.compare(password, user.password_hash);
    if(!is_password_valid) {
      res.status(401).json({ error: 'Invalid credentials'});
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );



    res.status(200).json({
      user: {
        id: user.id,
        username: user.username
      },
      token
    });

  } catch(error) {

    console.log("Error At Login Endpoint: ", error);
    res.status(500).json({ error: 'Internal server error' });

  }

});






module.exports = router;