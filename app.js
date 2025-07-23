import express from 'express';
import route from './utils/route.js';

const app = express();
const port = 3000;

app.set('view engine', 'hbs');
app.use(express.static('public'));

app.use('/', route)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});