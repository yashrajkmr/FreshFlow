// FreshFlow - Express.js Login Server
// Lab Exercise 4 - Login System using Express.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// middleware to parse incoming json and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files from current directory
app.use(express.static(path.join(__dirname)));

// hardcoded manager credentials for demo
// in real app these would come from a database
const VALID_USERS = [
  { username: 'manager', password: 'freshflow123', role: 'Store Manager' },
  { username: 'admin',   password: 'admin123',     role: 'Admin'         },
];

// route: serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// route: serve main landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index1.html'));
});

// POST route: handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // basic input check
  if (!username || !password) {
    return res.json({ success: false, message: 'Please enter both username and password.' });
  }

  // check credentials against our user list
  const user = VALID_USERS.find(
    u => u.username === username.trim() && u.password === password
  );

  if (user) {
    // login successful - send back user role
    return res.json({ success: true, message: 'Login Successful', role: user.role });
  } else {
    // invalid credentials
    return res.json({ success: false, message: 'Invalid Credentials' });
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`FreshFlow server running at http://localhost:${PORT}`);
});