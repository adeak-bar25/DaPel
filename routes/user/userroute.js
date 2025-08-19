import express from 'express';
import { renderPage } from './../route.js';
import { TokenVSchema, StudentVSchema } from '../../utils/controller/validate.js';
import { InputSession, Student } from '../../utils/data/data.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(301).redirect('/user/login');
});

router.get('/login', (req, res) => {
  console.log(req.query);
  if(req.query.e === 'inval') return renderPage(res, 'userlogin', 'Masukkan Token', null, 'Token tidak valid, token harus berupa angka 6 digit!');
  if(req.query.e === 'wrong') return renderPage(res, "userlogin", "Masukkan Token", null, "Token Salah, silahkan cek kembali!")
  renderPage(res, 'userlogin', 'Masukkan Token');
});

router.post('/login', async (req, res) => {
  res.clearCookie('token')
  console.log(req.body);
  const validatedToken = TokenVSchema.safeParse(req.body.token)
  const tokenInfo = await InputSession.checkToken(validatedToken.data)
  if(!tokenInfo) return res.status(400).redirect('/user/login?e=wrong')
  res.cookie('token', tokenInfo.token, { 
    httpOnly: true,
    sameSite: 'strict'
  });
  res.redirect('/user/input');
})

router.get('/input', async (req, res, next) => {
  const validatedToken = TokenVSchema.safeParse(req.cookies.token)
  if(!req.query.e && !validatedToken.success) return ;
  if(!validatedToken.success) return res.status(400).redirect('/user/login?e=inval');
  const tokenInfo = await InputSession.checkToken(validatedToken.data)
  if(!tokenInfo) return res.status(400).redirect('/user/login?e=wrong');
  renderPage(res, "userinput", "Masukkan Data Anda", {classname : [tokenInfo.grade, tokenInfo.className].join('-')});
})

router.post('/input', async (req, res, next) => {
  const validatedToken = TokenVSchema.safeParse(req.cookies.token)
  if(!validatedToken.success) return res.status(400).redirect('/user/login?e=inval');
  const tokenInfo = await InputSession.checkToken(validatedToken.data)
  if(!tokenInfo) return res.status(400).redirect('/user/login?e=wrong');
  const validatedInput = StudentVSchema.safeParse(req.body)
  if(!validatedInput.success) return res.status(400).redirect('/user/input?e=inval');

  const fObj = Object.assign({grade : tokenInfo.grade, className : tokenInfo.className}, validatedInput.data)

  try {
    await Student.insertStudent(fObj);
    res.status(303).send("Data berhasil disimpan, silahkan tunggu konfirmasi dari admin");
  } catch (error) {
    next(error);
  }
})

export default router;