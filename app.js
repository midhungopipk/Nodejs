const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); //This is the default anyway

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public'))); //will make the files in public folder globally available

app.use('/admin', adminRouter);

app.use(shopRouter);

app.use(errorController.get404Error);

app.listen(3000);
