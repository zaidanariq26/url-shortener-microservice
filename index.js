require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Gunakan middleware bodyParser untuk mengurai data formulir
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
	res.json({ greeting: 'hello API' });
});

let shortURL = {};

app.post('/api/shorturl', (req, res) => {
	const urlParams = req.body.url;
	const short_url = 3;
	const parsedUrl = url.parse(urlParams);
	const hostname = parsedUrl.hostname;

	dns.lookup(hostname, (err, address, family) => {
		if (err || !address) {
			res.json({ error: 'invalid url' });
			return;
		}

		const data = {
			original_url: urlParams,
			short_url,
		};
		shortURL.original_url = urlParams;
		shortURL.short_url = short_url;

		res.json(data);
	});
});

app.get('/api/shorturl/:url', (req, res) => {
	const urlParams = req.params.url;

	if (parseInt(urlParams, 10) === shortURL.short_url) {
		res.redirect(shortURL.original_url);
	} else {
		res.json({ error: 'invalid url' });
	}
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
