import express from 'express';
import { renderPage } from './../views/utils/render.js';
import userRouter from './user/userroute.js';
import adminRouter from './admin/adminroute.js';

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.get('/', (req, res) => {
  renderPage(res, 'home', 'Homepage');
})

router.use('/user', userRouter)

router.use('/admin', adminRouter)

export default router;
export { renderPage }