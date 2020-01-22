import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import MembershipPlanController from './app/controllers/MembershipPlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import QuestionController from './app/controllers/QuestionController';
import AnswerController from './app/controllers/AnswerController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/students/:index/checkin', CheckinController.store);
routes.get('/students/:index/checkin', CheckinController.index);
routes.post('/students/:index/help-orders', QuestionController.store);

routes.use(authMiddleware);
routes.put('/students/:index', StudentController.update);
routes.get('/users', UserController.index);
routes.post('/students', StudentController.store);

/**
 *  Membership Routes
 */
routes.post('/membership-plans', MembershipPlanController.store);
routes.delete('/membership-plans/:index', MembershipPlanController.delete);
routes.put('/membership-plans/:index', MembershipPlanController.update);
routes.get('/membership-plans', MembershipPlanController.index);

//
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:index', EnrollmentController.update);
routes.get('/enrollments', EnrollmentController.index);
routes.delete('/enrollments/:index', EnrollmentController.delete);

//
routes.get('/students/:index/help-orders', QuestionController.index);
routes.get('/help-orders', AnswerController.index);
routes.post('/help-orders/:index/answer', AnswerController.store);

export default routes;
