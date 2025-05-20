import { Router } from 'express';
import { WeatherController } from '../controllers/weatherController';
import { authenticate } from '../middleware/auth';

const router = Router();
const weatherController = new WeatherController();

router.get('/current', authenticate, (req, res) => weatherController.getCurrentWeather(req, res));
router.get('/queries', authenticate, (req, res) => weatherController.getQueries(req, res));

export const weatherRouter = router;