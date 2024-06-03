require('dotenv').config()
const express = require("express");
const config = require('./config/config')
const cors = require("cors");

const MySocketHandler = require('./src/infrastructure/events/handlerConection');

const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Running...');
});

app.use('/api', require('./src/routes/routes'));

new MySocketHandler(app);

