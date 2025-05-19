
import express from 'express';
import { getUsers, getUserById, createUser, updateUser, loginUser } from '../controllers/userController';

const router = express.Router();

// GET all users
router.get('/', getUsers);

// GET user by ID
router.get('/:id', getUserById);

// POST create new user
router.post('/', createUser);

// POST login user
router.post('/login', loginUser);

// PUT update user
router.put('/:id', updateUser);

export default router;
