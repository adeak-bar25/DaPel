import { port } from './utils/config.js';
import express from 'express';
import { connectToDB } from './utils/data/connection.js';
import mainRouter from './routes/route.js';
import path from 'path';
import { fileURLToPath } from 'url';
// import { getAllStudentData } from './utils/data/data.js';

import { Data } from './utils/data/model/dataModel.js';

connectToDB()

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use('/', mainRouter)


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;
