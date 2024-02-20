const express = require ('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

require('dotenv').config();

const app = express();

//middleware
app.use(helmet()); //security first
app.use(cors()); //enable cors
app.use(express.json()) //parse json requests
app.use(morgan('combined')); // log HTTP requests

//routes
app.use('/api', require('./src/routes/api'));

//error handlinng middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

const PORT = process.env.PORT  || 3003;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});