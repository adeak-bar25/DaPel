// import { port } from './utils/config.js';
import express from 'express';
import { connectToDB } from './utils/data/connection.js';
import mainRouter from './routes/route.js';
// import { getAllStudentData } from './utils/data/data.js';

connectToDB()

const app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use('/', mainRouter)

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

export default app;
