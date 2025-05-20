import { Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';
import { AuthService } from '../services/authService';

export class WeatherController {
  private weatherService: WeatherService;
  private authService: AuthService;

  constructor() {
    this.weatherService = new WeatherService();
    this.authService = new AuthService();
  }

  async getCurrentWeather(req: Request, res: Response) {
    try {
      const city = req.query.city as string;
      if (!city) {
        return res.status(400).json({ message: 'City parameter is required' });
      }

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const weatherData = await this.weatherService.getWeatherData(city, userId);
      res.json(weatherData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message === 'City not found' ? 404 : 500)
          .json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async getQueries(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const isAdmin = await this.authService.isAdmin(userId);
      const queries = isAdmin 
        ? await this.weatherService.getAllQueries()
        : await this.weatherService.getUserQueries(userId);

      res.json(queries);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}