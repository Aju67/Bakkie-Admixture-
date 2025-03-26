const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static('public'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(
  session({
    secret: 'your_secret_key', // Replace with a secure key in production
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to protect routes
function checkAuth(req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'logo.html'));
});
// GET /login - Show the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// POST /login - Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials (for testing)
  if (username === 'admin' && password === 'password') {
    req.session.loggedIn = true;
    res.redirect('/home');
  } else {
    res.send('<h3>Invalid credentials. <a href="/login">Try again</a></h3>');
  }
});

// GET /home - Protected home page
app.get('/home', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Other Pages

// GET /alter
app.get('/alter', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'alter.html'));
});

app.get('/procedure', (req, res) => {
  res.sendFile(path.join(__dirname, 'views','procedure.html'));
});


// GET /contact
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// GET /feedback
app.get('/feedback', checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'feedback.html'));
});

// GET /foods
app.get('/foods', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'foods.html'));
});

// 404 - Not Found
app.use((req, res) => {
  res.status(404).send('<h3>404 - Page Not Found</h3>');
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
