const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('./gamebridgeDB.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Create users table
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
            )`
        );
    }
});

// API endpoint for user registration
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.run(sql, [username, email, hashedPassword], (err) => {
            if (err) {
                console.error('Error registering user:', err);
                res.status(500).json({ error: 'Registration failed' });
            } else {
                console.log('User registered successfully');
                res.json({ message: 'Registration successful' });
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});


// API endpoint for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], async (err, user) => {
            if (err) {
                console.error('Error finding user:', err);
                return res.status(500).json({ error: 'Login failed' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare the provided password with the hashed password stored in the database
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Passwords match - user authenticated
            res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
