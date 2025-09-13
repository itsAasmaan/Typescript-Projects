import { Router } from 'express';
import WeatherController from '../controllers/weatherController';

const router = Router();

router.get('/current', (req, res) => WeatherController.getCurrentWeather(req, res));

router.get('/forecast', (req, res) => WeatherController.getWeatherForecast(req, res));

router.get('/search', (req, res) => WeatherController.searchWeather(req, res));

export default router;