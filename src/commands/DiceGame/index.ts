import { GenericCommand } from '@/commands/GenericCommand';

import type { CommandParams } from '@/types';
import { createErrorClient } from '@shared/src/types';

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

const ERRORS_MESSAGES = {
  wrongDicesNumber: (dicesNumber: number) => `You cant throw ${dicesNumber} dices, increase --n`,
  wrongDimensionsNumber: (dimensionsNumber: number) =>
    `There are no dices with ${dimensionsNumber} dimensions, increase --d`,
};

export class DiceGame extends GenericCommand {
  private readonly dicesNumber: number;
  private readonly dimensionsNumber: number;
  private readonly results: number[] = [];
  private readonly sum: number = 0;

  constructor(commandBody?: string) {
    super(params, commandBody);

    this.dicesNumber = this.getValueForParam('n');
    if (this.dicesNumber < 1) {
      throw createErrorClient(ERRORS_MESSAGES.wrongDicesNumber(this.dicesNumber));
    }

    this.dimensionsNumber = this.getValueForParam('d');
    if (this.dimensionsNumber < 2) {
      throw createErrorClient(ERRORS_MESSAGES.wrongDimensionsNumber(this.dimensionsNumber));
    }

    for (let i = 0; i < this.dicesNumber; i++) {
      const result = Math.floor(Math.random() * this.dimensionsNumber) + 1;

      this.results.push(result);
      this.sum += result;
    }
  }

  public getResult() {
    return [
      [`You've thrown ${this.dicesNumber} x d${this.dimensionsNumber}`, this.dicesNumber > 1 ? 'dices' : 'dice'].join(
        ' ',
      ),
      `results: [ ${this.results.join(', ')} ]`,
      `sum: ${this.sum}`,
    ].join('\n');
  }
}
