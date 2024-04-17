require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const salt = 10;

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors({}));
app.use(cookieParser());

// Connect to the MySQL Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// // Register User
app.post('/register', (req, res) => {
    const sql = 'INSERT INTO users (`userName`, `email`, `password`) VALUES (?)';
    const { userName, email, password } = req.body;

    bcrypt.hash(password.toString(), salt, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ Error: 'Error hashing password' });
        }

        const values = [userName, email, hash];

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ Error: 'Error inserting data' });
            }

            console.log('User registered successfully:', result.insertId);
            return res.status(200).json({ Status: 'Success' });
        });
    });
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
