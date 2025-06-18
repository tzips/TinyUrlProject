// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/DB/DB.js';
import linkRouts from './src/routs/linkRouts.js'; // שימו לב: השתמשתי ב-linkRouts
import userRouts from './src/routs/userRouts.js'; // שימו לב: השתמשתי ב-userRouts

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/links', linkRouts); // שימו לב: השתמשתי ב-linkRouts
app.use('/api/users', userRouts); // שימו לב: השתמשתי ב-userRouts

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});