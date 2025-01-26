const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.path}`);
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Geronimo8',
    database: 'travel_project'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Successfully connected to database');
});

// Signup Route
app.post('/signup', async (req, res) => {
    console.log('Signup Request Body:', req.body);
    const { username, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        connection.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Detailed Signup Error:', {
                    errorCode: err.code,
                    sqlMessage: err.sqlMessage,
                    sqlState: err.sqlState,
                    errno: err.errno
                });
                
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        error: 'Username or email already exists',
                        details: err.sqlMessage 
                    });
                }
                
                return res.status(500).json({ 
                    error: 'User registration failed', 
                    details: err.sqlMessage 
                });
            }
            res.status(201).json({ 
                message: 'User registered successfully',
                insertId: result.insertId 
            });
        });
    } catch (error) {
        console.error('Server-side signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login Route
app.post('/login', (req, res) => {
    console.log('Login Attempt:', req.body);
    const { username, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Database Query Error:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        
        console.log('Query Results:', results);
        
        if (results.length === 0) {
            console.log(`No user found with username: ${username}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = results[0];
        
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            
            console.log('Password Check:', {
                inputPassword: password,
                storedHashedPassword: user.password,
                passwordMatch: isMatch
            });
            
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ id: user.id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
            res.json({ token, username: user.username });
        } catch (compareError) {
            console.error('Password Compare Error:', compareError);
            res.status(500).json({ error: 'Server error during login' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));