import Router from 'express';
import { check } from 'express-validator';
const userController = require('../controllers/user.controller');
const roleMiddleware = require('../middleware/role.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const router = Router();


router.post('/registration', [
    check('username', 'username is empty').notEmpty(),
    check('password', 'incorrect password length').isLength({min: 4, max: 20})
] ,userController.registration);

router.post('/login', [
    check('username', 'username is empty').notEmpty(),
    check('password', 'password is empty').notEmpty()
], userController.login);

router.get('/users', authMiddleware(), userController.getUsers);


module.exports = router;