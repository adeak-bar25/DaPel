import express from 'express';
import mainRouter from './routes/route.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

try {
  mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
  console.log('Connected to Database')
} catch (error) {
  console.error(`Can't Connect to Database: ${error.message}`)
}


app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use('/', mainRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
