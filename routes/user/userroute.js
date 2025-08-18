import express from 'express';
import { renderPage } from './../route.js';
import { TokenVSchema } from '../../utils/controller/validate.js';
import { InputSession } from '../../utils/data/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(301).redirect('/user/login');
});

router.get('/login', (req, res) => {
  renderPage(res, 'userLogin', 'Masukkan Token');
});

router.post('/login', async (req, res) => {
  const validatedToken = TokenVSchema.safeParse(req.body.token)
  if(!validatedToken.success) return renderPage(res, "userLogin", "Masukkan Token", null, "Token tidak valid, token harus berupa angka 6 digit!")
  const tokenInfo = await InputSession.checkToken(validatedToken.data)
  console.log(tokenInfo)
})

router.get('/input', (req, res) => {
  renderPage(res, "userinput", "Masukkan Data Anda")
})

router.post('/input', (req, res) => {
  console.log(req.body)
})

export default router;