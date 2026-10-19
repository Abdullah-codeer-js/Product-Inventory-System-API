require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');

const pool = require('./src/models/db');
const routes = require('./src/routes/routes');

const app = express();
app.use(express.json());

const limit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: {
        statusCode: 429,
        message: 'too many requests'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limit);
app.use('/api/products', routes);

pool.connect((err, client, release) => {
    if (err) {
        console.log('connection error the database', err.stack);
        return;
    }
    console.log('connection successful with the database');
    release();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});