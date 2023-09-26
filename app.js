// const http = require('http');

const bodyParser = require('body-parser');
const express = require('express');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRoutes);

app.use(shopRouter);
// const server = http.createServer(app);
// server.listen(3000);

// or
app.listen(3000);
