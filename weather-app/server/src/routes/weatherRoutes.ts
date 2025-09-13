import { Router } from "express";
import weatherController from "../controllers/WeatherController";
import { requestLogger } from "../middleware/requestLogger";
import {
  validateCurrentWeatherRequest,
  validateForecastRequest,
  validateBulkSearchRequest,
} from "../middleware/validation";
import { strictLimiter, bulkLimiter } from "../middleware/rateLimiter";
import { asyncErrorHandler } from "../middleware/errorHandler";

const router = Router();

router.use(requestLogger);

router.get(
  "/current",
  validateCurrentWeatherRequest,
  asyncErrorHandler(weatherController.getCurrentWeather.bind(weatherController))
);

router.get(
  "/forecast",
  strictLimiter,
  validateForecastRequest,
  asyncErrorHandler(weatherController.getWeatherForecast.bind(weatherController))
);

router.get(
  "/search",
  bulkLimiter,
  validateBulkSearchRequest,
  asyncErrorHandler(weatherController.searchWeather.bind(weatherController))
);

export default router;
