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
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET'],
    credentials: true
}));
app.use(cookieParser());

// Connect to the MySQL Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Register User
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

            const userName = data[0].userName;
            const token = jwt.sign({ userName }, 'jwt-secret-key', { expiresIn: '1d' });
            res.cookie(`token`, token);
            console.log('User registered successfully:', result.insertId);
            return res.status(200).json({ Status: 'Success' });
        });
    });
});

// Login User
app.post('/login', (req, res) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: 'Login error in server' });
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: 'Password compare error' });
                if (response) {
                    const userName = data[0].userName;
                    const token = jwt.sign({ userName }, 'jwt-secret-key', { expiresIn: '1d' });
                    res.cookie(`token`, token);
                    return res.json({ Status: 'Success' });
                } else {
                    return res.json({ Error: 'Not the right password' });
                }
            });
        } else {
            return res.json({ Error: 'No email existed' });
        }
    })
})

// Logout User
app.get('/logout', (req, res) => {
    res.clearCookie(`token`);
    return res.json({ Status: 'Success' });
})

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Error: 'Unauthorized: No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: 'Unauthorized: Invalid token' });
        }
        req.userName = decoded.userName;
        next(); // Proceed to the next middleware or route handler
    });
};

// Protected route example
app.get('/dashboard', verifyToken, (req, res) => {
    // If token is verified, the user is authenticated
    // You can access req.userName to get the authenticated user's username
    res.status(200).json({ message: 'Access granted to dashboard' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
