import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import classRouter from './rest/route/class-end-point';
import studentRouter from './rest/route/student-end-point';
import userRouter from './rest/route/user-end-point';
import userAuthenticationRouter from './rest/route/user-authentication-end-point';
import googleAuthenticationRouter from './rest/route/google-authentication-end-point';
import activityCategoryRouter from './rest/route/activity-category-end-point';
import activityRouter from './rest/route/activity-end-point';

import { errorHandler } from './rest/middleware/error-handler';
import { jwtHandler } from './rest/middleware/jwt-handler';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(jwtHandler);

app.get('/health', (_req, res) => {
  res.json({ status: 'up' });
});
app.use('/classes', classRouter);
app.use('/students', studentRouter);
app.use('/users', userRouter);
app.use('/google-authentications', googleAuthenticationRouter);
app.use('/user-authentications', userAuthenticationRouter);
app.use('/activity-categories', activityCategoryRouter);
app.use('/activities', activityRouter);
app.use(errorHandler); // Global error handler

export default app;
