const { query } = require("../db/db");
const bcrypt = require("bcrypt");

const router = require('express').Router();

// Login Endpoint
router.post('/login', async (req, res) => {
  
  // console.log('Login Accessed');

  // try {

  //   const { username, password } = req.body

  //   const result = await query(

  //   );

  // } catch(error) {
  //   console.log("Error At Login Endpoint: ", error);
  //   res.status(500).json({ error: 'Internal server error' });
  // }
  
  res.status(200).json({ message: 'ok' });

});

module.exports = router;