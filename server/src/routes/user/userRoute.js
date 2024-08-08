import { Router } from "express";
import { getUserByIdController, getUsersController, signUp } from '../../controllers/user/userController.js'

const userRoute = Router();

// Get All Users
userRoute.get('/users', getUsersController);

// Get user by id
userRoute.get('/user/:id', getUserByIdController);

// Account Registration
userRoute.post('/user/sign-up', signUp);

// Creation of user information
userRoute.post('/user/create-information');

// Update user
userRoute.post('/user/update/:id');

//Delete user
userRoute.delete('/user/delete/:id');


export default userRoute;