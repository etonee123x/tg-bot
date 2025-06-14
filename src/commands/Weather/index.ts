import { fromUnixTime, format } from 'date-fns';

import { getWeather } from './api';
import { ParameterNumber, ParameterString } from '@/helpers/Parameter';
import { createErrorClient } from '@etonee123x/shared/helpers/error';

const ERRORS_MESSAGES = {
  moreThan5Days: () => "Can't get the weather data for more than 5 days, decrease (--days)",
  lessThan1Day: () => "Can't get the weather data for less than 1 day, increase (--days)",
};

export class Weather {
  // TODO: add languages
  private readonly country;
  private readonly city;
  private readonly days;

  constructor(commandBody: string) {
    this.days = new ParameterNumber('days').getValue(commandBody, 1);
    if (this.days > 5) {
      throw createErrorClient(ERRORS_MESSAGES.moreThan5Days());
    }

    if (this.days < 1) {
      throw createErrorClient(ERRORS_MESSAGES.lessThan1Day());
    }

    this.city = new ParameterString('city').getValue(commandBody);
    this.country = new ParameterString('country').getValue(commandBody, '') || undefined;
  }

  public async getResult() {
    return getWeather({ city: this.city, country: this.country }).then((response) =>
      response.list
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
        .trim(),
    );
  }
}
