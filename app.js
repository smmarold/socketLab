//Set up express
const express = require(`express`);
const app = express();
//Include the file system functions
const fs = require(`fs`);
//Include and set the hbs (handlebars) view engine
const hbs = require(`hbs`);
app.set(`view engine`, `hbs`);
//register the location of partial snippets for the view engine
hbs.registerPartials(__dirname + `/views/partials`, (err) => {});
//Uses extended url capability
app.use(express.urlencoded({ extended: true }));
//add the static asset folder
app.use(express.static(`${__dirname}/public`));
//allow express json functionality
app.use(express.json());

var names = [];
hbs.registerHelper('names', (name) => {
	if (!names.includes(name)) {
		names[names.length] = name;
	}
});

const { Server } = require('ws');
const sockserver = new Server({ port: 443 });

//path to the data folder
const data = `./data`;

//Route to the root directory. Displays "Hello World" in browser
app.get(`/`, (req, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
});

app.get('*', (req, res) => {
	res.sendFile(`${__dirname}/public/notFound.html`);
});

app.post('/names', (req, res) => {
	res.render('names.hbs', {
		nameFromForm: req.body.name,
	});
});

//Runs the server when npm app.js is run in the terminal

let port = process.env.PORT || 80;
app.listen(port, () => {
	console.log(`Server Running at localhost:${port}`);
});

sockserver.on('connection', (ws) => {
	console.log('New client connected!');
	sockserver.clients.forEach((client) => {
		const data = JSON.stringify({
			names: names,
		});
		client.send(data);
		console.log(client);
	});
	//console.log(ws);

	ws.on('close', () => console.log('Client has disconnected!'));
});
