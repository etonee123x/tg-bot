import GenericCommand from '@commands/GenericCommand';
import KnownError from '@/helpers/KnownError';
import { joinStr } from '@/utils';

import type { CommandParams } from '@/types';

const params: CommandParams = {
  n: {
    title: 'n',
    type: 'number',
    default: 1,
  },
  d: {
    title: 'd',
    type: 'number',
    default: 6,
  },
};

const _ERRORS_MESSAGES = {
  wrongDicesNumber: (dicesNumber: number) =>
    `You cant throw ${dicesNumber} dices, increase --n`,
  wrongDimensionsNumber: (dimensionsNumber: number) =>
    `There are no dices with ${dimensionsNumber} dimensions, increase --d`
}

export default class DiceGame extends GenericCommand {
  private readonly dicesNumber: number;
  private readonly dimensionsNumber: number;
  private readonly results: number[] = [];
  private readonly sum: number = 0;

  constructor(commandBody?: string) {
    super(params, commandBody);

    this.dicesNumber = this.getValueForParam('n');
    if (this.dicesNumber < 1) {
      throw new KnownError(_ERRORS_MESSAGES.wrongDicesNumber(this.dicesNumber));
    }

    this.dimensionsNumber = this.getValueForParam('d');
    if (this.dimensionsNumber < 2) {
      throw new KnownError(_ERRORS_MESSAGES.wrongDimensionsNumber(this.dimensionsNumber));
    }

    for (let i = 0; i < this.dicesNumber; i++) {
      const result = Math.floor(Math.random() * this.dimensionsNumber) + 1;
      this.results.push(result);
      this.sum += result;
    };
  }

  public getResult() {
    return joinStr(
      `You've thrown ${this.dicesNumber} x d${this.dimensionsNumber} ${this.dicesNumber > 1 ? 'dices' : 'dice'}:`,
      `results: [ ${this.results.join(', ')} ]`,
      `sum: ${this.sum}`,
      '\n'
    )
  }
}
