import express from 'express';
import { renderPage } from './../route.js';
import { TokenVSchema, StudentVSchema } from '../../utils/controller/validate.js';
import { InputSession, Student } from '../../utils/data/data.js';
import { validateAndGetTokenCookie } from '../../utils/controller/auth.js'

const router = express.Router();

router.get('/', (req, res) => {
  res.status(301).redirect('/user/login');
});

router.get('/login', (req, res) => {
  if(req.query.e === 'inval') return renderPage(res, 'userlogin', 'Masukkan Token', null, 'Token tidak valid, token harus berupa angka 6 digit!');
  if(req.query.e === 'wrong') return renderPage(res, "userlogin", "Masukkan Token", null, "Token Salah, silahkan cek kembali!")
  if(req.query.e === 'expired') return renderPage(res, "userlogin", "Masukkan Token", null, "Token Expired/Limit, silahkan hubungi admin!")
  renderPage(res, 'userlogin', 'Masukkan Token');
});

router.post('/login', async (req, res) => {
  res.clearCookie('token')
  const validatedToken = await TokenVSchema.safeParseAsync(req.body.token)
  console.log(validatedToken)
  if(!validatedToken.success){
    return res.status(400).redirect(`/user/login?e=${validatedToken.error.issues[0].code === "expired"? "expired" : "wrong" }`)
  }
  res.cookie('token', validatedToken.data, { 
    httpOnly: true,
    sameSite: 'strict'
  });
  res.redirect('/user/input');
})

router.get('/input', async (req, res, next) => {
  const tokenInfo = await validateAndGetTokenCookie(req, res)
  renderPage(res, "userinput", "Masukkan Data Anda", {classname : [tokenInfo.grade, tokenInfo.className].join('-')});
})

router.post('/input', async (req, res, next) => {
  const tokenInfo = await validateAndGetTokenCookie(req, res)

  const validatedInput = await StudentVSchema.safeParseAsync(req.body)
  if(!validatedInput.success) {
    const errorMsgArr = validatedInput.error.issues.map(e => e.message)
    renderPage(res, 'userinput', 'Masukkan Data Anda', null, errorMsgArr.length > 1? [errorMsgArr.slice(0, errorMsgArr.length - 1).join(", ") , errorMsgArr[errorMsgArr.length - 1]].join(", dan "): errorMsgArr[0])
    return res.status(400);
  }

  const a = Object.assign({grade : tokenInfo.grade, className : tokenInfo.className, token : tokenInfo.token}, validatedInput.data)
  try {
    await Student.insertStudent(a);
    res.status(303).send("Data berhasil disimpan");
  } catch (error) {
    next(error);
  }
})

export default router;