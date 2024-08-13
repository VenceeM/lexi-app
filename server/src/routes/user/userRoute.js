import { Router } from "express";
import {
    getUserByIdController,
    getUsersController,
    insertUserInformationController,
    getUserInformationController,
    updateUserController,
    deleteAccountController
} from '../../controllers/user/userController.js'

const userRoute = Router();

// Get All Users
userRoute.get('/users', getUsersController);

// Get user by id
userRoute.get('/user/information', getUserByIdController);

// Creation of user information
userRoute.post('/user/create-information', insertUserInformationController);

// // Get user information
// userRoute.get('/user/information', getUserInformationController)

// Update user
userRoute.put('/user/update/:userId', updateUserController);

//Delete user
userRoute.put('/user/delete/:userId', deleteAccountController);


export default userRoute;