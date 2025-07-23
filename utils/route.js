import express from 'express';
import { headHTML } from './layout.js';
const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.get('/user', (req, res) => {
  res.render('userLogin', {head : headHTML('Masukkan Token')});
});

router.post('/user/login', (req, res) => {
  console.log(req.body);
  res.status(303)
  res.redirect('/user');
})

router.get('/admin', (req, res) => {
  res.render('adminLogin', {head : headHTML('Masukkan Token')});
})

router.get('/admin/new', (req, res) => {
  res.render('newAdmin', {head : headHTML('Tambah Admin')})
})

router.post('/admin/login', (req, res) => {
  console.log(req.body);
  res.status(303)
  res.redirect('/admin/dashboard');
})


export default router;