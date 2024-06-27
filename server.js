const express = require('express');
const bodyParser=require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

var apiRoutes = require('./routes/apiRoutes');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});