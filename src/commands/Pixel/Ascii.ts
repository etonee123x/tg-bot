import GenericPixelClass from '@commands/Pixel/GenericPixelClass';
import KnownError from '@/helpers/KnownError';
import { joinStr } from '@/utils';

import type { CommandParams } from '@/types';

const params: CommandParams = {
  W: {
    title: 'W',
    type: 'number',
  },
  compact: {
    title: 'compact',
    type: 'boolean',
    default: false,
  },
};

const _ERRORS_MESSAGES = {
  tooLargeSize: (isCompact: boolean) =>
    joinStr(
      'The final result will not fit in a single message, try decrease "--w" value',
      !isCompact && 'or use the "--compact" flag',
      ' '
    )
}

export default class Ascii extends GenericPixelClass {
  private width: number;
  private readonly isCompact: boolean;
  private readonly palette = ' .,:;i1tfLCG08@'.split('')

  constructor(filePath: string, commandBody?: string) {
    super(filePath, params, commandBody);
    this.isCompact = this.getValueForParam('compact');
    this.width = this.getValueForParam('W');
  }

  public async getResult() {
    const isResultLengthMoreThan4000 = (w: number, h: number) => {
      const markdownLength = '```\n```'.length;
      const newLineSignsLength = h;
      const singleSymbolLength = this.isCompact ? 1 : 2;
      const result = markdownLength + w * h * singleSymbolLength + newLineSignsLength - h * Number(this.isCompact);
      return result > 4000;
    }
    const getLastWidthBeforeResultLengthWillBecomeMoreThan4000 = () => {
      let cellSize = 0, h: number, w: number;
      do {
        ++cellSize;
        h = Math.floor(this.image.getHeight() / cellSize);
        w = Math.floor(this.image.getWidth() / cellSize);
      } while (
        isResultLengthMoreThan4000(w, h) &&
        w <= this.image.getWidth() &&
        h <= this.image.getHeight()
      );
      return Math.min(w - 1, this.image.getWidth());
    }
    const getGray = (x: number, y: number) => {
      const { r, g, b} = this.getPixelColor(x, y);
      return Math.floor((r + g + b) / 3);
    }

    await this.readBuffer();

    let xPix = this.width = this.width ?? getLastWidthBeforeResultLengthWillBecomeMoreThan4000();
    const cellSize = Math.floor(this.image.getWidth() / xPix);
    let yPix = Math.floor(this.image.getHeight() / cellSize);
    if (isResultLengthMoreThan4000(xPix, yPix)) {
      throw new KnownError(_ERRORS_MESSAGES.tooLargeSize(this.isCompact));
    }

    let maxBrightness = 0
    const grayTable: number[][] = []

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
        grayTable[h].push(gray);
      }
    }
    
    let result = '```\n';
    for (let i = 0; i < grayTable.length; i++) {
      for (let j = 0; j < grayTable[i].length; j++) {
        result += (this.isCompact || j === 0 ? '' : ' ')
          + this.palette[Math.floor((grayTable[i][j] * (this.palette.length - 1)) / Number(maxBrightness))];
      }
      result += '\n';
    }
    result += '```';

    return result
  }
}
