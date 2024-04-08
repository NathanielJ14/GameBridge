const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5000;

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create a table (users) if not exists
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)');
});

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Get all users
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get a specific user by ID
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(row);
    });
});

// Create a new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
    }
    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name, email });
    });
});

// Update an existing user
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
    }
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ id, name, email });
    });
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
