const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs'); // for templating

const PORT = 3000;
const HEADERS = {
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache'
};

const clients = {};

function httpStreamHandler(req, res, next) {
  const topic = req.params.topic
  res.writeHead(200, HEADERS);
  const clientId = Date.now(); // just a simple way to generate a different ID for each new client
  const newClient = {id: clientId, res};
  if (!clients[topic]) clients[topic] = []
  clients[topic].push(newClient);
  req.on('close', () => {
    clients[topic] = clients[topic].filter(c => c.id !== clientId);
  });
}

function sendNewDataToAllClients(topic, newData) {
  if (!clients[topic]) clients[topic] = []
  clients[topic].forEach(c => c.res.write(`data: ${JSON.stringify(newData)}\n\n`))
}

function newDataHandler(req, res, next) {
  const topic = req.params.topic
  const newData = req.body;
  if (!newData.hasOwnProperty(timestamp)) newData.timestamp = timestamp();
  res.json(newData)
  sendNewDataToAllClients(topic, newData);
}

function clientHandler(req, res) {
  const topic = req.params.topic
  res.render('client', {topic})
}

app.post('/topics/:topic', newDataHandler);

app.get('/stream/:topic', httpStreamHandler);

app.get('/topics/:topic', clientHandler);

const timestamp = () => new Date();

app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`)
})