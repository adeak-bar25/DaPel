import express from 'express';
import { renderPage, renderStudentData, getAllStudentData } from './../route.js';
import { authenticateAdmin, createNewAdminAccount, createNewAdminSession, generateInputToken, cookieLogin, changePassword } from '../../utils/controller/auth.js';
import { AdminSession, Admin, InputSession, Student } from '../../utils/data/data.js';
import { ZodError, StudentVSchema, InputSessionVSchema } from './../../utils/controller/validate.js'

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(301);
  res.redirect('/admin/login');
})

router.get('/login', async (req, res) => {
  const adminTotal = await Admin.countDocuments();
  renderPage(res, adminTotal > 0 ? 'adminlogin' : 'newadmin', adminTotal > 0? 'Login Sebagai Admin' : 'Daftar Admin');
})

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {res.status(400); return renderPage(res, 'adminlogin', 'Login Sebagai Admin', null, 'Username dan Password harus diisi');}
  console.log(`Login attempt with username: "${req.body.username}" at ${new Date().toLocaleString()}`);
  const auth = await authenticateAdmin(req.body.username, req.body.password);
  if(auth){
    await createNewAdminSession(req.body.username, res)
    res.status(303).redirect('/admin/dashboard')
    console.log(`Username : "${req.body.username}" successfully login at ${new Date().toLocaleString()} \n`)
  }else{
    res.status(401)
    renderPage(res, 'adminlogin', 'Login Sebagai Admin', null, 'Username atau Password salah');
  }
})

router.post('/new', async (req, res) => {
  if(await Admin.countDocuments() > 0) {
    res.status(403);
    return renderPage(res, 'adminlogin', 'Login Sebagai Admin', null, 'Admin sudah ada, silahkan login!');
  }
  if (!req.body.username || !req.body.password) {
    res.status(400);
    return renderPage(res, 'newadmin', 'Daftar Admin', null, 'Username dan Password harus diisi');
  }
  await createNewAdminAccount(req.body.username, req.body.password);
  console.log('New admin account created:', req.body.username);
  await createNewAdminSession(req.body.username, res)
  res.status(303).redirect('/admin/dashboard');
})

router.use('/dashboard/', async (req, res, next) => {
  const uuid = req.cookies.loginDapelSes
  if(!uuid) return res.status(401).redirect('/admin/login')
  const session = await cookieLogin(uuid)
  if(!session.isValid) return res.status(401).redirect('/admin/login')
  if(!req.cookies.tempSession) session.setSessionCookie(res).increaseCookieTime(res)
  next()
})

router.get('/dashboard', async (req, res, next) => {
  try {
    renderPage(res, 'dashboardhome', 'Dashboard Admin', {lastLogin : await AdminSession.lastBeforeLatestLogin(), lastInput : await Student.getlastUpdated()} )
  } catch (error) {
    next(error)
  }
})

router.get('/dashboard/data', async (req, res) => {
  try {
    renderPage(res, 'dashboarddata', 'Data - Dashboard Admin', {studentData : renderStudentData(await getAllStudentData())} )
  } catch (error) {
    next(error)
  }
})

router.get('/dashboard/options', (req, res) => {
  renderPage(res, 'dashboardoption', 'Option - Dashboard Admin')
})

router.get('/dashboard/control', (req, res) => {
  renderPage(res, 'dashboardcontrol', 'Control - Dashboard Admin')
})

router.post('/dashboard/api/newinputsec', async (req, res, next) =>{
  const {grade, className, maxInput, expireAt} = req.body;
  const token = generateInputToken()
  try {
    const validatedInput = InputSessionVSchema.safeParse({grade, className, maxInput, token, expireAt : expireAt? new Date(expireAt).toISOString(): null})
    if(!validatedInput.success) {
      const errorMsgArr = validatedInput.error.issues.map(e => e.message)
      return res.status(400).json({
        ok : false,
        msg : errorMsgArr.length > 1? [errorMsgArr.slice(0, errorMsgArr.length - 1).join(", ") , errorMsgArr[errorMsgArr.length - 1]].join(", dan "): errorMsgArr[0]
      })
    }
    try {
      await InputSession.addNewSession(validatedInput.data)
      return res.json({ok: true,token})
    } catch (error) {
      return next(error)
    }
  }catch (err) {
    next(err)
  }
})

router.delete('/dashboard/api/delete/student', async (req, res, next) => {
  if(!req.body.id) {
    return res.status(400).json({ok: false, msg: "ID tidak boleh kosong!"})
  }
  try{
    await Student.deleteStudent(req.body.id)
    res.json({ok: true, msg: "Data siswa berhasil dihapus!"})
  }catch (err) {
    next(err)
  }
})

router.put('/dashboard/api/update/password', async (req, res, next) => {
  const {["loginDapelSes"] : sessionUUID, oldPassword, newPassword} = Object.assign(req.cookies, req.body);
  // console.log(oldPassword, newPassword, sessionUUID);
  if(!oldPassword || !newPassword){
    return res.status(400).json({ok: false, msg: "Password lama dan baru harus diisi!"})
  }
  try {
    await changePassword(sessionUUID, oldPassword, newPassword)
    return res.json({ok: true, msg: "Password berhasil diubah!"})
  } catch (error) {
    if(error.message === "Password lama salah") return res.status(400).json({ok: false, msg: error.message})
    next(error)
  }
})

export default router;