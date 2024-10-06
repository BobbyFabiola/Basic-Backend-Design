const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user'); // Make sure this path is correct

const app = express();

app.use(bodyParser.json());

app.use('/api/users', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});