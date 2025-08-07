import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';

import achievementRouter from '@api/achievement/achievement-router';
import achievementApprovalRouter from '@api/achievement-approval/achievement-approval-router';
import activityRouter from '@api/activity/activity-router';
import activityCategoryRouter from '@api/activity-category/activity-category-router';
import googleAuthenticationRouter from '@api/authentication/google-authentication-router';
import userAuthenticationRouter from '@api/authentication/user-authentication-router';
import classRouter from '@api/class/class-router';
import { errorHandler } from '@api/middleware/error-handler';
import { jwtHandler } from '@api/middleware/jwt-handler';
import studentRouter from '@api/student/student-router';
import userRouter from '@api/user/user-router';

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
app.use('/achievements', achievementRouter);
app.use('/achievement-approvals', achievementApprovalRouter);
app.use(errorHandler); // Global error handler

export default app;
