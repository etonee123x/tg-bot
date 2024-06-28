import { createErrorClient } from '@shared/src/types';
import { isNil, isString } from '@shared/src/utils';

type ParameterType = string | number | boolean;

interface Parameter<T extends ParameterType> {
  getValue(commandBody: string, valueDefault?: T): T;
}

const ERRORS_MESSAGES = {
  missingRequiredParameter: (paramTitle: string) => `Missing required parameter ${paramTitle}`,
  wrongParameterValue: (paramTitle: string) => `Wrong parameter ${paramTitle} value`,
};

export class ParameterBoolean implements Parameter<boolean> {
  constructor(private title: string) {}

  getValue: Parameter<boolean>['getValue'] = (commandBody) => {
    return new RegExp(`--${this.title}`, 'gmi').test(commandBody);
  };
}

export class ParameterString implements Parameter<string> {
  constructor(private title: string) {}

  getValue: Parameter<string>['getValue'] = (commandBody, valueDefault) => {
    const result = commandBody.match(new RegExp(`(?<=--${this.title} )[^ ]+`, 'gmi'))?.[0] ?? valueDefault;

    if (isNil(result)) {
      throw createErrorClient(ERRORS_MESSAGES.missingRequiredParameter(this.title));
    }

    return result;
  };
}

export class ParameterText implements Parameter<string> {
  constructor(private title: string) {}

  getValue: Parameter<string>['getValue'] = (commandBody, valueDefault) => {
    const result = commandBody.match(new RegExp(`(?<=--${this.title} ').*(?=')`))?.[0] ?? valueDefault;

    if (isNil(result)) {
      throw createErrorClient(ERRORS_MESSAGES.missingRequiredParameter(this.title));
    }

    return result;
  };
}

export class ParameterNumber implements Parameter<number> {
  constructor(private title: string) {}

  getValue: Parameter<number>['getValue'] = (commandBody, valueDefault) => {
    let result: number | undefined;
    const maybeResult = commandBody.match(new RegExp(`(?<=--${this.title} )-?\\d+`, 'gmi'))?.[0];

    if (isString(maybeResult)) {
      const resultNumbered = Number(maybeResult);

      if (isNaN(resultNumbered)) {
        throw createErrorClient(ERRORS_MESSAGES.wrongParameterValue(this.title));
      } else {
        result = resultNumbered;
      }
    }

    result ??= valueDefault;

    if (isNil(result)) {
      throw createErrorClient(ERRORS_MESSAGES.missingRequiredParameter(this.title));
    }

    return result;
  };
}
