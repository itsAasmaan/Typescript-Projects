import { Request, Response, NextFunction } from "express";

export const validateCurrentWeatherRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { city, lat, lon, units } = req.query;

  try {
    if (!city && (lat === undefined || lon === undefined)) {
      res.status(400).json({
        success: false,
        error: {
          code: "MISSING_LOCATION",
          message: "Location parameter required",
          details:
            "Either city name or coordinates (lat, lon) must be provided",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (city) {
      if (typeof city !== "string") {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_CITY",
            message: "Invalid city parameter",
            details: "City must be a string",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const trimmedCity = city.trim();
      if (trimmedCity.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: "EMPTY_CITY",
            message: "City name cannot be empty",
            details: "Please provide a valid city name",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (trimmedCity.length > 100) {
        res.status(400).json({
          success: false,
          error: {
            code: "CITY_TOO_LONG",
            message: "City name too long",
            details: "City name must be less than 100 characters",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check for potentially malicious input
      if (
        trimmedCity.includes("<") ||
        trimmedCity.includes(">") ||
        trimmedCity.includes("script")
      ) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_CHARACTERS",
            message: "Invalid characters in city name",
            details: "City name contains invalid characters",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    // Validate coordinates if provided
    if (lat !== undefined || lon !== undefined) {
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);

      if (isNaN(latitude) || isNaN(longitude)) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_COORDINATES",
            message: "Invalid coordinates",
            details: "Latitude and longitude must be valid numbers",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (latitude < -90 || latitude > 90) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_LATITUDE",
            message: "Invalid latitude",
            details: "Latitude must be between -90 and 90 degrees",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (longitude < -180 || longitude > 180) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_LONGITUDE",
            message: "Invalid longitude",
            details: "Longitude must be between -180 and 180 degrees",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    // Validate units if provided
    if (units && !["metric", "imperial", "kelvin"].includes(units as string)) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_UNITS",
          message: "Invalid units parameter",
          details: "Units must be one of: metric, imperial, kelvin",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Sanitize query parameters
    if (city) {
      req.query.city = (city as string).trim();
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: "An error occurred while validating the request parameters",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const validateForecastRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  validateCurrentWeatherRequest(req, res, () => {
    const { days } = req.query;
    if (days !== undefined) {
      const parsedDays = parseInt(days as string, 10);

      if (isNaN(parsedDays)) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_DAYS",
            message: "Invalid days parameter",
            details: "Days must be a valid number",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (parsedDays < 1 || parsedDays > 5) {
        res.status(400).json({
          success: false,
          error: {
            code: "DAYS_OUT_OF_RANGE",
            message: "Days parameter out of range",
            details: "Days must be between 1 and 5",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    next();
  });
};

export const validateBulkSearchRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { cities, type, units } = req.query;
  try {
    if (!cities || typeof cities !== "string") {
      res.status(400).json({
        success: false,
        error: {
          code: "MISSING_CITIES",
          message: "Cities parameter required",
          details: "Cities must be provided as a comma-separated string",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Parse and validate city list
    const cityList = cities
      .split(",")
      .map((city) => city.trim())
      .filter((city) => city.length > 0);

    if (cityList.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          code: "NO_VALID_CITIES",
          message: "No valid cities provided",
          details: "At least one valid city name is required",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (cityList.length > 10) {
      res.status(400).json({
        success: false,
        error: {
          code: "TOO_MANY_CITIES",
          message: "Too many cities requested",
          details: "Maximum 10 cities allowed per bulk request",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validate each city name
    for (const city of cityList) {
      if (city.length > 100) {
        res.status(400).json({
          success: false,
          error: {
            code: "CITY_NAME_TOO_LONG",
            message: "City name too long",
            details: `City name "${city}" exceeds 100 characters limit`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check for potentially malicious input
      if (city.includes("<") || city.includes(">") || city.includes("script")) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_CITY_CHARACTERS",
            message: "Invalid characters in city name",
            details: `City name "${city}" contains invalid characters`,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    // Validate type parameter
    if (type && !["current", "forecast"].includes(type as string)) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_TYPE",
          message: "Invalid type parameter",
          details: 'Type must be either "current" or "forecast"',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Validate units parameter
    if (units && !["metric", "imperial", "kelvin"].includes(units as string)) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_UNITS",
          message: "Invalid units parameter",
          details: "Units must be one of: metric, imperial, kelvin",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Sanitize the cities parameter
    req.query.cities = cityList.join(",");

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: "BULK_VALIDATION_ERROR",
        message: "Bulk request validation failed",
        details:
          "An error occurred while validating the bulk request parameters",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  for (const key in req.query) {
    if (typeof req.query[key] === "string") {
      req.query[key] = (req.query[key] as string)
        .replace(/[<>]/g, "") // Remove < and > characters
        .replace(/script/gi, "") // Remove script tags (case insensitive)
        .trim(); // Remove leading/trailing whitespace
    }
  }

  next();
};
