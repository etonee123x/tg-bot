import { fromUnixTime, format } from 'date-fns';
import GenericCommand from '@commands/GenericCommand';
import KnownError from '@/helpers/KnownError';

import type { CommandParams } from '@/types';
import { getWeather } from './api';

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
  moreThan5Days: () => "Can't get the weather data for more than 5 days, decrease (--days)",
  lessThan1Day: () => "Can't get the weather data for less than 1 day, increase (--days)",
};

export default class Weather extends GenericCommand {
  // @TODO: add languages
  private readonly country: string;
  private readonly city: string;
  private readonly days: number;

  constructor(commandBody?: string) {
    super(params, commandBody);

    this.days = this.getValueForParam('days');
    if (this.days > 5 || this.days < 1) {
      throw this.days > 5
        ? new KnownError(_ERRORS_MESSAGES.moreThan5Days())
        : new KnownError(_ERRORS_MESSAGES.lessThan1Day());
    }

    this.city = this.getValueForParam('city');
    this.country = this.getValueForParam('country');
  }

  public async getResult() {
    const weather = await getWeather({ city: this.city, country: this.country });

    return weather.list
      .slice(0, this.days * 8)
      .reduce(
        (acc, item) =>
          (acc +=
            [
              `${format(fromUnixTime(item.dt), 'dd/MM, H')}h:`,
              `Avg. temp: ${item.main.temp > 0 ? `+${item.main.temp}` : item.main.temp}°C`,
              `Cloudiness: ${item.clouds.all}%`,
              `Wind: ~${item.wind.speed}m/s (up to ${item.wind.gust}m/s)`,
              `Pressure: ${((item.main.pressure * 760) / 1013.25).toFixed(0)}mm Hg`,
            ].join('\n') + '\n\n'),
        `Here's a weather forecast for ${this.days > 1 ? `${this.days} days` : 'a day'} forward in ${this.city}:\n\n`,
      )
      .trim();
  }
}
