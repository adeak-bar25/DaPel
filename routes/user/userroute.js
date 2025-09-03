import express from 'express';
import { renderPage, renderFormField } from '../../views/utils/render.js';
import { StudentVSchema } from '../../utils/controller/validate.js';
import { DataModel, TokenModel } from '../../utils/data/data.js';
// import { validateAndGetTokenCookie } from '../../utils/controller/auth.js'

const router = express.Router();

router.get('/', (req, res) => {
  res.status(301).redirect('/user/login');
});

router.get('/login', (req, res) => {
  function showPage(msg){
      return renderPage(res, 'userlogin', 'Masukkan Token', null, msg? msg : null);
  }

  switch(req.query.e){
    case 'inval':
      return showPage('Token tidak valid, token harus berupa angka 6 digit!');
    case 'wrong':
      return showPage("Token Salah, silahkan cek kembali!")
    case 'expired':
      return showPage("Token Expired/Limit, silahkan hubungi admin!")
    case 'intrna':
      return showPage("Server gagal mengecek token, silahkan coba lagi!")
    default:
      return showPage();
  }
});

router.post('/login', (req, res) => {
  res.redirect(`/user/input?token=${req.body.token}`);
})

router.use(async (req, res, next) => {
  function redirectBadReq(errCode){
    res.status(400).redirect(`/user/login${errCode? `?e=${errCode}` : ''}`)
  }

  const tokeninfo = await TokenModel.isUseAble(req.query.token)
  if(!tokeninfo.success) return redirectBadReq(tokeninfo.errCode)
  next();
})

router.get('/input', async (req, res, next) => {
  const tokenInfo = await DataModel.getDataInfoByToken(req.query.token)

  renderPage(res, "userinput", "Masukkan Data Anda", {fields : renderFormField(tokenInfo.fields)});
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