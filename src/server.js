const express = require('express');
const httpProxy = require('express-http-proxy');
const cors = require('cors');
const path = require('path');
const middleware = require('./middlewares/middleware');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express();

const userServiceProxy = httpProxy(process.env.AUTH_API_URL);
const listsServiceProxy = httpProxy(process.env.LISTS_API_URL);

const site = process.env.ALLOW_FROM_URL || 'http://localhost:8080';
app.use(cors({
    origin: site,
    optionsSuccessStatus: 200 
}));
app.get('/', (req, res) => res.send('Hello Gateway API'));

app.get('/auth/*', (req, res, next) => userServiceProxy(req, res, next));
app.get('/list*', (req, res, next) => middleware(req, res, () => listsServiceProxy(req, res, next)));

const port = process.env.PORT || 3000;
app.listen(port);
