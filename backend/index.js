const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");

const app = express();
const Routes = require('./routes/route.js');

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(bodyParser.json({ limit: '15mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }))

app.use(express.json({ limit: '50mb' }));
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log("MongoDB Atlas Status: ACTIVE"))
.catch((err) => console.log("MongoDB Atlas Status: INACTIVE \n", err));

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server PORT: ${PORT}`);
})