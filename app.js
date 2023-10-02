// const http = require('http');

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();

app.engine(
	'hbs',
	exphbs({
		layoutsDir: 'views/layouts/', //used to render layout for handlebar
		defaultLayout: 'main-layout', //used to render layout for handlebar
		extname: 'hbs', //used to render layout for handlebar
	}),
);
//switching to handlebars --> we can set hbs or handlebars just by ourself
app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
app.set('views', 'views'); //This is the default anyway

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //will make the files in public folder globally available
app.use('/admin', adminData.routes);

app.use(shopRouter);

app.use((req, res, next) => {
	// res.status(404).sendFile(path.join(__dirname, './', 'views', '404.html'));
	res.status(404).render('404', { pageTitle: 'Error' });
});

app.listen(3000);
