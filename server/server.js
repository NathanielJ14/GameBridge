const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET'],
    credentials: true
}));
app.use(cookieParser());

//Create new mysql db connection





// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
