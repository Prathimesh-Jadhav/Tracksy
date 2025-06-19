const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');


//route imports:
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const salesRouter = require('./routes/salesRoutes');

const {authorize} = require('./Auth/authorization');
const {salesForecast} = require('./controller/salesForecast');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/uploads', express.static('uploads'));
app.use(cors({
    origin: '*'
}))
app.use(express.json());

//routes
app.use('/api/userRoutes', userRouter);
app.use('/api/productRoutes',authorize, productRouter);
app.use('/api/salesRoutes',authorize, salesRouter);

app.get('/api/salesForecast/:type',authorize,salesForecast)


//connect to mongodb:
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
})
