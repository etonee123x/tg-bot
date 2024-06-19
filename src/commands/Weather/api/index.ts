import { client } from '@/api';

interface GetWeatherResponse {
  cod: string;
  message: string;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: { all: number };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: { '3h': number };
    snow?: { '3h': number };
    sys: { pod: string };
    dt_txt: string;
  }>;
}

export const getWeather = ({ city, country }: { city: string; country?: string }) =>
  client<GetWeatherResponse>('http://api.openweathermap.org/data/2.5/forecast', {
    query: {
      q: [city, ...(country ? [country] : [])].join(),
      appid: process.env.WEATHER_API_KEY,
      units: 'metric',
    },
  });
