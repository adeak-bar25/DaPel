import express from 'express';
import { renderPage } from './../route.js';
import { checkTotalAdmin } from '../../utils/data/data.js';
import { authenticateAdmin, createNewAdminAccount } from '../../utils/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(301);
  res.redirect('/admin/login');
})

router.get('/login', async (req, res) => {
  const adminTotal = await checkTotalAdmin()
  renderPage(res, adminTotal > 0 ? 'adminlogin' : 'newadmin', adminTotal > 0? 'Login Sebagai Admin' : 'Daftar Admin');
})

router.post('/login', async (req, res) => {
  console.log('Req Check ✅')
  console.log(req.body)
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Username and password are required');
  }
  console.log('Login attempt from admin with username:', req.body.username);
  const auth = await authenticateAdmin(req.body.username, req.body.password)
  console.log('Authentication result:', auth);
  if(auth){
    res.status(303).send('Login successful');
  }else{
    res.status(401)
    renderPage(res, 'adminlogin', 'Login Sebagai Admin', null, 'Username atau Password salah');
  }
})

router.post('/new', async (req, res) => {
  console.log('Req Check ✅')
  console.log(req.body)
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Username and password are required');
  }
  if(await checkTotalAdmin() > 0){
    return res.status(401).send('Admin already exists, you should make new account via dashboard');
  }
  await createNewAdminAccount(req.body.username, req.body.password);
  console.log('New admin account created:', req.body.username);
  res.status(303)
  res.redirect('/admin/dashboard');
})

router.get('/dashboard', (req, res) => {
  renderPage(res, 'dashboard', 'Dashboard Admin')
})

export default router;