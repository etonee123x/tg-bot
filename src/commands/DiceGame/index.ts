import { ParameterNumber } from '@/helpers/Parameter';
import { createErrorClient } from '@etonee123x/shared/helpers/error';

const ERRORS_MESSAGES = {
  wrongDicesNumber: (dicesNumber: number) => `You cant throw ${dicesNumber} dices, increase --n`,
  wrongDimensionsNumber: (dimensionsNumber: number) =>
    `There are no dices with ${dimensionsNumber} dimensions, increase --d`,
};

export class DiceGame {
  private readonly dicesNumber: number;
  private readonly dimensionsNumber: number;
  private readonly results: number[] = [];
  private readonly sum: number = 0;

  constructor(commandBody: string) {
    this.dicesNumber = new ParameterNumber('n').getValue(commandBody, 1);
    if (this.dicesNumber < 1) {
      throw createErrorClient(ERRORS_MESSAGES.wrongDicesNumber(this.dicesNumber));
    }

    this.dimensionsNumber = new ParameterNumber('d').getValue(commandBody, 6);
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
