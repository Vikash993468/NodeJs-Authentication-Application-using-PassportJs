// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const authRoutes = require('./routes/auth');
const initializePassport = require('./config/passport');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myAuthApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

app.use('/auth', authRoutes);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('<h1>Home</h1>');
});

app.get('/login', (req, res) => {
  res.render('login', { messages: req.flash('error') });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

app.listen(4000, () => {
  console.log('Server started on http://localhost:4000');
});
