import express from 'express';
import { renderPage } from './../route.js';
import { TokenVSchema } from '../../utils/controller/validate.js';

const router = express.Router();


router.get('/', (req, res) => {
  renderPage(res, 'userLogin', 'Masukkan Token');
});

router.post('/login', (req, res) => {
  const validatedToken = TokenVSchema.safeParse(req.body.token)
  if(!validatedToken.success) return renderPage(res, "userLogin", "Masukkan Token", null, "Token tidak valid, token harus berupa angka 6 digit!")
})

router.get('/input', (req, res) => {
  renderPage(res, "userinput", "Masukkan Data Anda")
})

router.post('/input', (req, res) => {
  console.log(req.body)
})

export default router;