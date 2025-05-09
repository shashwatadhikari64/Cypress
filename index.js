const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(__dirname));

const fs = require('fs');
let currentUser = null;

// Path to users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// REGISTER endpoint
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  console.log('register attempt:', req.body);
  
  // Read existing users from users.json
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read users.json:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      console.error('Failed to parse users.json:', parseErr);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    // Check if the email is already registered
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    // Add new user to the users array
    const newUser = {
      name,
      email,
      password,
      registrationDate: new Date().toISOString() // Store the registration date
    };
    users.push(newUser);

    // Save updated users array back to users.json
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Failed to write to users.json:', writeErr);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      res.json({ success: true, message: 'Registration successful!' });
    });
  });
});

// LOGIN endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('login attempt:', req.body);

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read users.json:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    let users = [];
    try {
      users = JSON.parse(data);
    } catch (parseErr) {
      console.error('Failed to parse users.json:', parseErr);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ success: true });
      currentUser = user;
      console.log('currentUser:', currentUser);
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Endpoint to receive incident reports
app.post('/report', (req, res) => {
  const report = req.body;
  //report.userId = currentUser.email;
  console.log('incident report:', report);

  const reportFiles = path.join(__dirname, 'incidents.json');

  // Read existing reports
  fs.readFile(reportFiles, 'utf8', (err, data) => {
    let reports = [];
    if (!err && data) {
      try {
        reports = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing incidents:', parseErr);
      }
    }

    // Add new report
    reports.push(report);

    fs.writeFile(reportFiles, JSON.stringify(reports, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Failed to write incidents:', writeErr);
      }
      res.json({ status: 'success', message: 'Incident reported' });
    });
  });
});


// Endpoint to retrieve all reported incidents
app.get('/incidents', (req, res) => {
  const reportFiles = path.join(__dirname, 'incidents.json');

  fs.readFile(reportFiles, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading incidents.json:', err);
      return res.status(500).json({ error: 'Failed to load incidents.' });
    }

    try {
      const reports = JSON.parse(data);
      res.json(reports);
    } catch (parseErr) {
      console.error('Error parsing incidents.json:', parseErr);
      res.status(500).json({ error: 'Failed to parse incidents.' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
