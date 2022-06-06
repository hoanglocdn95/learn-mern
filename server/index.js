const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

const app = express();
const PORT = 5000;
const MONGOOSE_SERVER = `mongodb+srv://${process.env.MONGOOSEDB_ID}:${process.env.MONGOOSEDB_PASSWORD}@learn-mern.q6r78.mongodb.net/?retryWrites=true&w=majority`;

const connectMongoDB = async () => {
  try {
    const server = await mongoose.connect(MONGOOSE_SERVER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('connectMongooseDB ~ server');
  } catch (err) {
    console.log('connectMongooseDB ~ err', err);
  }
};

connectMongoDB();

// app.get('/', (req, res) => res.send('Hello'));

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.listen(PORT, () => console.log('Server at ' + PORT));
