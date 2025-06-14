import { GenericPixelClass } from '@/commands/Pixel/GenericPixelClass';
import { ParameterBoolean, ParameterNumber } from '@/helpers/Parameter';
import { createErrorClient } from '@etonee123x/shared/helpers/error';
import { throwError } from '@etonee123x/shared/utils/throwError';

const ERRORS_MESSAGES = {
  tooLargeSize: (isCompact: boolean) =>
    [
      'The final result will not fit in a single message, try decrease "--w" value',
      ...(isCompact ? [] : ['or use the "--compact" flag']),
    ].join(' '),
};

export class Ascii extends GenericPixelClass {
  private static readonly PALETTE = ' .,:;i1tfLCG08@'.split('');

  private readonly width;
  private readonly isCompact;

  constructor(filePath: string, commandBody: string) {
    super(filePath);

    this.isCompact = new ParameterBoolean('compact').getValue(commandBody);
    this.width = new ParameterNumber('w').getValue(commandBody, 0) || undefined;
  }

  public async getResult() {
    const isResultLengthMoreThan4000 = (w: number, h: number) => {
      const markdownLength = '```\n```'.length;
      const newLineSignsLength = h;
      const singleSymbolLength = this.isCompact ? 1 : 2;
      const result = markdownLength + w * h * singleSymbolLength + newLineSignsLength - h * Number(this.isCompact);

      return result > 4000;
    };

    const getLastWidthBeforeResultLengthWillBecomeMoreThan4000 = () => {
      let cellSize = 0;
      let h: number;
      let w: number;

      do {
        ++cellSize;
        h = Math.floor(this.image.height / cellSize);
        w = Math.floor(this.image.width / cellSize);
      } while (isResultLengthMoreThan4000(w, h) && w <= this.image.width && h <= this.image.height);

      return Math.min(w - 1, this.image.width);
    };

    const getGray = (x: number, y: number) => {
      const { r, g, b } = this.getPixelColor(x, y);

      return Math.floor((r + g + b) / 3);
    };

    await this.readBuffer();

    let xPix = this.width ?? getLastWidthBeforeResultLengthWillBecomeMoreThan4000();
    const cellSize = Math.floor(this.image.width / xPix);
    let yPix = Math.floor(this.image.height / cellSize);

    if (isResultLengthMoreThan4000(xPix, yPix)) {
      throw createErrorClient(ERRORS_MESSAGES.tooLargeSize(this.isCompact));
    }

    let maxBrightness = 0;
    const grayTable: number[][] = [];

    const sizes = this.crop(cellSize);

    xPix = sizes.xPix;
    yPix = sizes.yPix;
    for (let h = 0; h < yPix; h++) {
      grayTable.push([]);
      for (let w = 0; w < xPix; w++) {
        const { x, y } = {
          x: Math.floor(w * cellSize + cellSize / 2),
          y: Math.floor(h * cellSize + cellSize / 2),
        };
        const gray = getGray(x, y);

        maxBrightness = Math.max(gray, maxBrightness);
        (grayTable[h] ?? throwError()).push(gray);
      }
    }

    let result = '```\n';

    for (let i = 0; i < grayTable.length; i++) {
      for (let j = 0; j < (grayTable[i] ?? throwError()).length; j++) {
        result +=
          (this.isCompact || j === 0 ? '' : ' ') +
          Ascii.PALETTE[
            Math.floor(
              (((grayTable[i] ?? throwError())[j] ?? throwError()) * (Ascii.PALETTE.length - 1)) /
                Number(maxBrightness),
            )
          ];
      }

      result += '\n';
    }

    result += '```';

    return result;
  }
}
