import express from 'express';
import { getAllUsers, getOneUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();



router.get('/users', getAllUsers);
router.get('/user/:_id', getOneUser);
router.put('/user/:_id', updateUser);
router.delete('/user/:_id', deleteUser); 

export default router;
