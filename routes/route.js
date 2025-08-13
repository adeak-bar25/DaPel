import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import { renderPage, renderStudentData} from './../views/utils/render.js';
import userRouter from './user/userroute.js';
import adminRouter from './admin/adminroute.js';
import {  getAllStudentData } from '../utils/data/data.js';

const router = express.Router();

router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));
router.use(express.json())

router.get('/', (req, res) => {
  renderPage(res, 'home', 'Homepage');
})

router.use('/user', userRouter)

router.use('/admin', adminRouter)

router.use((req, res) => {
  res.status(404).send("Not Found")
})

router.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    ok: false,
    message: err.message || 'Internal Server Error'
  })
})

export default router;
export { renderPage, renderStudentData, getAllStudentData }