const express = require('express');
const httpProxy = require('express-http-proxy');
const cors = require('cors');
const path = require('path');
const middleware = require('./middlewares/middleware');
const helmet = require('helmet')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express()

app.use(helmet())
const site = process.env.ALLOW_FROM_URL;
app.use(cors({
    origin: site,
    optionsSuccessStatus: 200    
}));

const userServiceProxy = httpProxy(process.env.AUTH_API_URL);
const listsServiceProxy = httpProxy(process.env.LISTS_API_URL);

app.post('/auth/*', (req, res, next) => userServiceProxy(req, res, next));
app.get('/auth/*', (req, res, next) => userServiceProxy(req, res, next));
app.put('/auth/*', (req, res, next) => userServiceProxy(req, res, next));
app.delete('/auth/*', (req, res, next) => userServiceProxy(req, res, next));


app.get('/list*', (req, res, next) => middleware(req, res, () => listsServiceProxy(req, res, next)));
app.put('/list*', (req, res, next) => middleware(req, res, () => listsServiceProxy(req, res, next)));
app.delete('/list*', (req, res, next) => middleware(req, res, () => listsServiceProxy(req, res, next)));
app.post('/list*', (req, res, next) => middleware(req, res, () => listsServiceProxy(req, res, next)));

const port = process.env.PORT || 3000;
app.listen(port);
