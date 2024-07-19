const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes/login');
const teamsRouter = require('./routes/teams');
const blogsRouter = require('./routes/blogs');
const achievementsRouter = require('./routes/achievement');
const focusareasRouter = require('./routes/focusarea');
const projectsRouter = require('./routes/project');
const hackathonsRouter = require('./routes/hackathon');
const photoGalleriesRouter = require('./routes/photogallery');
const contactRouter = require('./routes/contact');
const alumniRouter = require('./routes/alumni');
const eventRouter = require('./routes/event');

const app = express();

// Middleware
app.use(express.json());
app.use(session({
  secret: 'P&u#h@^-$ec*e%',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://project-k-hub.onrender.com' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true,
}));

// MongoDB Atlas connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://ankamreddiprudhvi:lNwcWmFzhfYzkGAC@k-hub.edtz4n3.mongodb.net/?retryWrites=true&w=majority&appName=K-Hub';

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch(err => {
  console.error('MongoDB Atlas connection error:', err);
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Routes
app.use('/', routes);
app.use('/teams', teamsRouter);
app.use('/blogs', blogsRouter);
app.use('/achievement', achievementsRouter);
app.use('/focusarea', focusareasRouter);
app.use('/project', projectsRouter);
app.use('/hackathon', hackathonsRouter);
app.use('/photo-gallery', photoGalleriesRouter);
app.use('/alumni', alumniRouter);
app.use('/contact', contactRouter);
app.use('/event', eventRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));