import express from 'express';
import { UserController } from '../controller/userController';
import { authorizeUser } from '../middleware/authentication';
import RoleAuthorize from '../middleware/roleAuthenticator';

const route = express.Router();

route.post('/', UserController.signUp);
route.post('/login', UserController.login);
route.put('/', authorizeUser, UserController.updateUser);
route.delete('/', authorizeUser, UserController.deleteUser);
route.post('/questions', authorizeUser, new RoleAuthorize(['Admin']).authorizeUser, UserController.addQuestion);
route.post('/result', authorizeUser, UserController.addResult);
route.get('/paper', authorizeUser, UserController.generateQuiz)
route.get('/questions', authorizeUser, new RoleAuthorize(['Admin']).authorizeUser, UserController.allQuestion)
route.get('/', authorizeUser, new RoleAuthorize(['Admin']).authorizeUser, UserController.allUser)
route.get('/details', authorizeUser, UserController.getDetails)
route.get('/result', authorizeUser, UserController.lastResult)
route.get('/history', authorizeUser, UserController.getHistory)

export default route;