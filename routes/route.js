import express from 'express';
import cookieParser from 'cookie-parser';
import { renderPage, renderStudentData } from './../views/utils/render.js';
import userRouter from './user/userroute.js';
import adminRouter from './admin/adminroute.js';
import { checkTotalAdmin, getAllStudentData } from '../utils/data/data.js';

const router = express.Router();

router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  renderPage(res, 'home', 'Homepage');
})

router.use('/user', userRouter)

router.use('/admin', adminRouter)

export default router;
export { renderPage, renderStudentData, checkTotalAdmin, getAllStudentData }