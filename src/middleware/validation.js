import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

export const validateUserLogin = [
  body('email').notEmpty().withMessage('El email es obligatorio'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  }
];

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};