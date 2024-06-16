import { fromUnixTime, format } from 'date-fns';
import GenericCommand from '@commands/GenericCommand';
import KnownError from '@/helpers/KnownError';
import { get } from '@/http'
import { joinStr } from '@/utils'

import type { CommandParams } from '@/types';

interface WeatherItem {
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
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h': number;
  };
  snow?: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface Response {
  cod: string;
  message: string;
  cnt: number;
  list: WeatherItem[];
}

const params: CommandParams = {
  city: {
    title: 'city',
    type: 'string',
    required: true,
  },
  country: {
    title: 'country',
    type: 'string',
    default: null,
  },
  days: {
    title: 'days',
    type: 'number',
    default: 1,
  },
};

const _ERRORS_MESSAGES = {
  moreThan5Days: () =>
    "Can't get the weather data for more than 5 days, decrease (--days)",
  lessThan1Day: () =>
    "Can't get the weather data for less than 1 day, increase (--days)",
  badResponse: ({ message, cod }: { message: string, cod: string }) =>
    `An error occurred in getting data: ${message} (code ${cod})`
}

export default class Weather extends GenericCommand {
  // @TODO: add languages
  private readonly url: string;
  private readonly city: string;
  private readonly days: number;

  constructor(commandBody?: string) {
    super(params, commandBody);

    this.days = this.getValueForParam('days');
    if (this.days > 5 || this.days < 1) {
      throw this.days > 5
        ? new KnownError(_ERRORS_MESSAGES.moreThan5Days())
        : new KnownError(_ERRORS_MESSAGES.lessThan1Day())
    }
    
    this.city = this.getValueForParam('city');
    const country = this.getValueForParam('country');

    this.url = joinStr(
      'http://api.openweathermap.org/data/2.5/forecast',
      `?q=${this.city}`,
      country && `,${country}`,
      `&appid=${process.env.WEATHER_API_KEY}&units=metric`,
      ''
    );
  }

  public async getResult() {
    const formForecastRes = (item: WeatherItem) => {
      const paToMmOfMercury = (pa: number) => ((item.main.pressure * 760) / 1013.25).toFixed(0)
      return joinStr(
        `${format(fromUnixTime(item.dt), 'dd/MM, H')}h:`,
        `Avg. temp: ${item.main.temp > 0 ? `+${item.main.temp}` : item.main.temp}°C`,
        `Cloudiness: ${item.clouds.all}%`,
        `Wind: ~${item.wind.speed}m/s (up to ${item.wind.gust}m/s)`,
        `Pressure: ${paToMmOfMercury(item.main.pressure)}mm Hg`,
        '\n'
      ) + '\n\n'
    }
    
    const response = await get<Response>(this.url)
      .catch(e => {
        throw e instanceof KnownError
          ? e
          : new KnownError(_ERRORS_MESSAGES.badResponse(e.response.data))
      });
    return response.list
      .slice(0, this.days * 8)
      .reduce(
        (acc, item) => acc += formForecastRes(item),
        `Here's a weather forecast for ${this.days > 1 ? `${this.days} days` : `a day`} forward in ${this.city}:\n\n`
      )
      .trim()
  }
}
