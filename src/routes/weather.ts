import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected weather routes
router.get('/current', authenticate, (req, res) => {
  // TODO: Implement weather fetching
  res.json({ message: 'Weather endpoint - to be implemented' });
});

export const weatherRouter = router;