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
    // Get user inputs from form
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

                // Generate JWT token and cookie using user id
                const userId = result.insertId;
                const token = jwt.sign({ userId }, 'jwt-secret-key', { expiresIn: '1d' });
                res.cookie(`token`, token);

                // Return userId and success to client
                return res.status(200).json({ Status: 'Success', userId });
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
                // On success generate token and set cookie using user id
                if (response) {
                    const userId = data[0].id
                    const token = jwt.sign({ userId }, 'jwt-secret-key', { expiresIn: '1d' });
                    res.cookie(`token`, token);
                    // Return user id on success to client
                    return res.json({ Status: 'Success', userId });
                } else {
                    // Password is incorrect
                    return res.status(400).json({ Error: 'Incorrect password' });
                }
            });
        } else {
            // Email is not registered in db
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

// Auth middleware to verify user from token
const verifyToken = (req, res, next) => {
    // Get token from cookie
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Error: 'Unauthorized: No token provided' });
    }
    jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: 'Unauthorized: Invalid token' });
        }
        req.userId = decoded.userId;
        // Proceed to the next middleware or route handler
        next();
    });
};

// Protected route for user dashboard
app.get('/dashboard/:id', verifyToken, (req, res) => {
    // Get the userId
    const userId = req.userId;

    // Fetch user information based on the userId
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user info:', err);
            return res.status(500).json({ Error: 'Error fetching user info' });
        }

        // If user isnt found throw error
        if (result.length === 0) {
            return res.status(404).json({ Error: 'User not found' });
        }

        // Set userdata to data found in db
        const userData = result[0];
        // Respond with user data 

        return res.status(200).json(userData);
    });
});

// Protected route for user account
app.get('/account/:id', verifyToken, async (req, res) => {
    try {
        // Get the userId
        const userId = req.userId;

        // Try querying accounts table first
        let sql = 'SELECT * FROM accounts WHERE userId = ?';
        db.query(sql, [userId], async (err, result) => {
            if (err) {
                console.error('Error fetching accounts info:', err);
                throw new Error('Error fetching accounts info');
            }

            if (result.length === 0) {
                // If no info found in accounts table, fallback to users table
                sql = 'SELECT * FROM users WHERE id = ?';
                db.query(sql, [userId], (err, userResult) => {
                    if (err) {
                        console.error('Error fetching user info:', err);
                        throw new Error('Error fetching user info');
                    }

                    if (userResult.length === 0) {
                        return res.status(404).json({ Error: 'User not found' });
                    }

                    const userData = userResult[0];
                    res.status(200).json(userData);
                });
            } else {
                // If data found in accounts table, return the account data
                const accountData = result[0];
                res.status(200).json(accountData);
            }
        });
    } catch (error) {
        // Throw error
        console.error('Error:', error);
        return res.status(500).json({ Error: 'Internal Server Error' });
    }
});

// Update or add user account
app.post('/account/:id', verifyToken, (req, res) => {
    // Get the userId
    const userId = req.userId;

    // Extract account data from request body
    const { steamKey, steamId } = req.body;

    // Check if the account already exists for the user
    const checkAccountQuery = 'SELECT * FROM accounts WHERE userId = ?';
    db.query(checkAccountQuery, [userId], (err, result) => {
        if (err) {
            console.error('Error checking account:', err);
            return res.status(500).json({ Error: 'Error checking account' });
        }

        if (result.length === 0) {
            // If account does not exist, insert new record
            const insertAccountQuery = 'INSERT INTO accounts (userId, steamKey, steamId) VALUES (?, ?, ?)';
            db.query(insertAccountQuery, [userId, steamKey, steamId], (err, result) => {
                if (err) {
                    console.error('Error inserting account data:', err);
                    return res.status(500).json({ Error: 'Error inserting account data' });
                }

                console.log('Account data inserted successfully');
                return res.status(200).json({ Status: 'Success' });
            });
        } else {
            // If account exists, update existing record
            const updateAccountQuery = 'UPDATE accounts SET steamKey = ?, steamId = ? WHERE userId = ?';
            db.query(updateAccountQuery, [steamKey, steamId, userId], (err, result) => {
                if (err) {
                    console.error('Error updating account data:', err);
                    return res.status(500).json({ Error: 'Error updating account data' });
                }

                console.log('Account data updated successfully');
                return res.status(200).json({ Status: 'Success' });
            });
        }
    });
});

// Fetch user's Steam friends list
app.get('/steam/friends', verifyToken, (req, res) => {
    const userId = req.userId;

    // Get the user's Steam API key from the database
    const sql = 'SELECT steamKey, steamId FROM accounts WHERE userId = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching Steam API key and Steam ID:', err);
            return res.status(500).json({ Error: 'Error fetching Steam API key and Steam ID' });
        }

        // If users API key or ID cant be found throw error
        if (result.length === 0) {
            return res.status(404).json({ Error: 'Steam API key or Steam ID not found' });
        }

        const { steamKey, steamId } = result[0];

        // Fetch friends list from Steam API
        const friendsUrl = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${steamKey}&steamid=${steamId}&relationship=friend`;
        fetch(friendsUrl)
            .then(response => response.json())
            .then(friendsData => {
                if (!friendsData.friendslist || !friendsData.friendslist.friends) {
                    return res.status(404).json({ Error: 'No friends found' });
                }

                const friendIds = friendsData.friendslist.friends.map(friend => friend.steamid).join(',');

                // Fetch friends' summaries (including online status) from Steam API
                const summariesUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamKey}&steamids=${friendIds}`;
                return fetch(summariesUrl)
                    .then(response => response.json())
                    .then(summariesData => res.json(summariesData))
                    .catch(error => {
                        console.error('Error fetching friends summaries:', error);
                        res.status(500).json({ Error: 'Error fetching friends summaries' });
                    });
            })
            .catch(error => {
                console.error('Error fetching friends list:', error);
                res.status(500).json({ Error: 'Error fetching friends list' });
            });
    });
});

// Add a friend
app.post('/friend/:id', verifyToken, (req, res) => {
    // Get the userId
    const userId = req.userId;

    // Extract friend data from request body
    const { name, steamFriendId } = req.body;

    // SQL querie to create new friend
    const insertFriendQuery = 'INSERT INTO friends (userId, name, steamFriendId) VALUES (?, ?, ?)';
    db.query(insertFriendQuery, [userId, name, steamFriendId], (err, result) => {
        if (err) {
            console.error('Error inserting friend data:', err);
            return res.status(500).json({ Error: 'Error inserting friend data' });
        }

        console.log('Friend added successfully');
        return res.status(200).json({ Status: 'Success' });
    });
});

// Get all friends info
app.get('/friend/:id', verifyToken, (req, res) => {
    // Get the userId
    const userId = req.userId;

    // Fetch friends information based on the userId
    const sql = 'SELECT * FROM friends WHERE userId = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user friends info:', err);
            return res.status(500).json({ Error: 'Error fetching user friends info' });
        }

        // If no friends exist throw error
        if (result.length === 0) {
            return res.status(404).json({ Error: 'Friends not found' });
        }

        // Respond with friend 
        return res.status(200).json(result);
    });
});



// Setup for discord connection



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
