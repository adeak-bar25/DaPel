import express from 'express';
import { renderPage } from './../route.js';

const router = express.Router();


router.get('/', (req, res) => {
  renderPage(res, 'userLogin', 'Masukkan Token');
});

router.post('/login', (req, res) => {
  console.log(req.body);
  res.status(303)
  res.redirect('/user');
})

export default router;