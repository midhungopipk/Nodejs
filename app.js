const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); //This is the default anyway

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public'))); //will make the files in public folder globally available

app.use('/admin', adminData.routes);

app.use(shopRouter);

app.use((req, res, next) => {
	res.status(404).render('404', { pageTitle: 'Error' });
});

app.listen(3000);
