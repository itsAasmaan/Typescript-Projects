import { Router } from 'express';
import WeatherController from '../controllers/weatherController';

const router = Router();

router.get('/current', (req, res) => WeatherController.getCurrentWeather(req, res));

export default router;