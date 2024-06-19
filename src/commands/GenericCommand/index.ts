import { KnownError } from '@/helpers/KnownError';

import type { CommandParamOptions, CommandParams } from '@/types';

const _ERRORS_MESSAGES = {
  MISSING_VALUE_FOR_TEXT_PARAM: () => 'Value for text param is missing',
  missingRequiredParam: (type: CommandParamOptions['type'], title: string) => `Missing required ${type} param ${title}`,
  wrongParamType: (paramTitle: string) => `Wrong type for param ${paramTitle}, it should be number`,
  missingValueForStringParam: (paramTitle: string) => `Value for string param ${paramTitle} is missing`,
};

export class GenericCommand {
  constructor(
    private readonly commandParams: CommandParams,
    private readonly commandBody: string = '',
  ) {}

  protected getParamValue(param: CommandParamOptions) {
    switch (param.type) {
      case 'number':
        if (param.required) {
          this.checkIfParamIsPresent(param);
        }

        return this.getNumberValue(param.title);
      case 'string':
        if (param.required) {
          this.checkIfParamIsPresent(param);
        }

        return this.getStringValue(param.title);
      case 'boolean':
        return this.checkIfParamIsPresent(param);
      case 'text':
        return this.getTextValue();
      default:
        return undefined;
    }
  }

  protected getValueForParam(paramTitle: string) {
    return this.checkIfParamIsPresent(this.commandParams[paramTitle])
      ? this.getParamValue(this.commandParams[paramTitle])
      : this.commandParams[paramTitle].default;
  }

  private checkIfParamIsPresent(param: CommandParamOptions) {
    const executed = new RegExp(param.type !== 'text' ? `--${param.title}` : "'.*'", 'gmi').exec(this.commandBody);

    if (!!param.required && !executed) {
      throw new KnownError(_ERRORS_MESSAGES.missingRequiredParam(param.type, param.title));
    }

    return !!executed;
  }

  private getNumberValue(paramTitle: string) {
    const executed = new RegExp(`--${paramTitle} (-?\\d+)`, 'gmi').exec(this.commandBody);

    if (!executed) {
      throw new KnownError(_ERRORS_MESSAGES.wrongParamType(paramTitle));
    }

    return Number(executed[1]);
  }

  private getStringValue(paramTitle: string) {
    const executed = new RegExp(`--${paramTitle} ([^ ]+)`, 'gmi').exec(this.commandBody);

    if (!executed) {
      throw new KnownError(_ERRORS_MESSAGES.missingValueForStringParam(paramTitle));
    }

    return executed[1];
  }

  private getTextValue() {
    const executed = /(?<=').*(?=')"/.exec(this.commandBody);

    if (!executed) {
      throw new KnownError(_ERRORS_MESSAGES.MISSING_VALUE_FOR_TEXT_PARAM());
    }

    return executed[0];
  }
}
