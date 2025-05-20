import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { logger } from '../utils/logger';

interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

interface CacheEntry {
  data: any;
  expiry: number;
}

class WeatherCache {
  private static instance: WeatherCache;
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL = 1800000; // 30 minutes in milliseconds

  private constructor() {
    // Run cleanup every 5 minutes
    setInterval(() => this.cleanup(), 300000);
  }

  static getInstance(): WeatherCache {
    if (!WeatherCache.instance) {
      WeatherCache.instance = new WeatherCache();
    }
    return WeatherCache.instance;
  }

  set(key: string, value: any): void {
    this.cache.set(key, {
      data: value,
      expiry: Date.now() + this.defaultTTL
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

const prisma = new PrismaClient();
const cache = WeatherCache.getInstance();

export class WeatherService {
  private readonly API_KEY: string;
  private readonly API_BASE_URL: string;
  
  constructor() {
    if (!process.env.WEATHER_API_KEY) {
      throw new Error('WEATHER_API_KEY environment variable is not set');
    }
    if (!process.env.WEATHER_API_URL) {
      throw new Error('WEATHER_API_URL environment variable is not set');
    }
    this.API_KEY = process.env.WEATHER_API_KEY;
    this.API_BASE_URL = process.env.WEATHER_API_URL;
  }

  async getWeatherData(city: string, userId: string) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      await this.logWeatherQuery(userId, city, cachedData);
      return cachedData;
    }

    try {
      const response = await axios.get<WeatherResponse>(`${this.API_BASE_URL}/weather`, {
        params: {
          q: city,
          appid: this.API_KEY,
          units: 'metric'
        }
      });

      const weatherData = {
        city: response.data.name,
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed
      };

      cache.set(cacheKey, weatherData);
      await this.logWeatherQuery(userId, city, weatherData);

      return weatherData;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 404) {
          throw new Error('City not found');
        }
        throw new Error('Weather service unavailable');
      }
      throw error;
    }
  }

  async logWeatherQuery(userId: string, location: string, result: any) {
    await prisma.weatherQuery.create({
      data: {
        userId,
        location,
        result
      }
    });
  }

  async getUserQueries(userId: string) {
    return prisma.weatherQuery.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllQueries() {
    return prisma.weatherQuery.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}