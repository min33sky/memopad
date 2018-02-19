import express from 'express';
import morgan from 'morgan';    // HTTP Request Logger
import bodyParser from 'body-parser';   // Parse HTML Body
import path from 'path';

import mongoose from 'mongoose';    // MongoDB 데이터 모델링 툴
import session from 'express-session';  // Express session

import api from './routes';

const app = express();
const port = process.env.PORT || 5000;


// MongoDB Connection
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log('Connected to mongodb server');});

// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect('mongodb://localhost/memopad');

// use session
app.use(session({
    name: 'session',
    secret: 'min33sky@h!a!',
    resave: false,
    saveUninitialized: true
}));

app.use(morgan('dev'));     // HTTP Request Log
app.use(bodyParser.json()); // HTTP Body parser

// Serve static files from the React app
app.use('/', express.static(`${__dirname}/../client/build`));

// setup routers & static directory
app.use('/api', api);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

// Handle Error
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
