const { query } = require("../db/db");
const bcrypt = require("bcrypt");

const router = require('express').Router;

// Login Endpoint
router.post('/login', (req, res) => {
  
  console.log('Login Accessed');
  
});