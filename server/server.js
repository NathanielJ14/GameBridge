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
    const { userName, email, password, confirmPassword } = req.body;

    // Check if the passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ Error: 'Passwords do not match' });
    }

    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ Error: 'Error checking email' });
        }

        if (result.length > 0) {
            // Email already exists in the database
            return res.status(400).json({ Error: 'Email already in use' });
        }

        // Email is unique, proceed to hash password and register user
        bcrypt.hash(password.toString(), salt, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ Error: 'Error hashing password' });
            }

            const values = [userName, email, hash];
            const insertUserQuery = 'INSERT INTO users (`userName`, `email`, `password`) VALUES (?)';

            db.query(insertUserQuery, [values], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).json({ Error: 'Error inserting data' });
                }

                console.log('User registered successfully:', result.insertId);

                // Generate JWT token
                const userId = result.insertId;
                const token = jwt.sign({ userId }, 'jwt-secret-key', { expiresIn: '1d' });
                res.cookie(`token`, token);

                return res.status(200).json({ Status: 'Success' });
            });
        });
    });
});

// Login User
app.post('/login', (req, res) => {
    // Create sql query to find user
    const sql = `SELECT * FROM users WHERE email = ?`;
    // Use sql query to find user info in db
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: 'Login error in server' });

        // Compare password to hashed password
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: 'Password compare error' });
                // On success generate token and set cookie
                if (response) {
                    const userId = data[0].id
                    const token = jwt.sign({ userId }, 'jwt-secret-key', { expiresIn: '1d' });
                    res.cookie(`token`, token);
                    return res.json({ Status: 'Success' });
                } else {
                    return res.status(400).json({ Error: 'Incorrect password' });
                }
            });
        } else {
            return res.status(400).json({ Error: 'User email is not registered' });
        }
    })
})

// Logout User
app.get('/logout', (req, res) => {
    // Clears cookies
    res.clearCookie(`token`);
    return res.json({ Status: 'Success' });
})

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Error: 'Unauthorized: No token provided' });
    }
    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: 'Unauthorized: Invalid token' });
        }
        req.userId = decoded.userId;
        next(); // Proceed to the next middleware or route handler
    });
};

// Protected routes
app.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.userId; // Get the userId from the decoded JWT token

    // Fetch user information based on the userId
    const sql = 'SELECT userName, email FROM users WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).json({ Error: 'Error fetching user info' });
        }

        if (result.length === 0) {
            return res.status(404).json({ Error: 'User not found' });
        }

        const userData = result[0];
        res.status(200).json(userData); // Respond with user data (username, email)
    });
});

// Protected routes
app.get('/account', verifyToken, (req, res) => {
    const userId = req.userId; // Get the userId from the decoded JWT token

    // Fetch user information based on the userId
    const sql = 'SELECT userName, email FROM users WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).json({ Error: 'Error fetching user info' });
        }

        if (result.length === 0) {
            return res.status(404).json({ Error: 'User not found' });
        }

        const userData = result[0];
        res.status(200).json(userData); // Respond with user data (username, email)
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
