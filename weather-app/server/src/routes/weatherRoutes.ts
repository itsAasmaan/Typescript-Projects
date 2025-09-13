import { Router } from 'express';
import WeatherController from '../controllers/WeatherController';
import { requestLogger } from '../middleware/requestLogger';

const router = Router();

router.use(requestLogger);

router.get('/current', (req, res) => WeatherController.getCurrentWeather(req, res));

router.get('/forecast', (req, res) => WeatherController.getWeatherForecast(req, res));

router.get('/search', (req, res) => WeatherController.searchWeather(req, res));

export default router;