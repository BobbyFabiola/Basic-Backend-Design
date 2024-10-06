const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/users', userRoutes); // Use the user routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
