import { Jimp } from 'jimp';
import { getFileByPath } from '@/api';
import { createErrorClient } from '@etonee123x/shared/helpers/error';
import { throwError } from '@etonee123x/shared/utils/throwError';

interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const ERRORS_MESSAGES = {
  cellSizeIsTooLarge: (cellSize: number) =>
    `This image is too small to pixelizate it with x${cellSize} cell size, try to decrease (--size)`,
};

export class GenericPixelClass {
  private _jimpImage?: Awaited<ReturnType<(typeof Jimp)['read']>>;

  constructor(private readonly filePath: string) {}

  protected async readBuffer() {
    const file = await getFileByPath(this.filePath);

    this.image = await Jimp.read(file);
  }

  protected crop(cellSize: number) {
    const xPix = Math.floor(this.image.width / cellSize);
    const yPix = Math.floor(this.image.height / cellSize);

    if (!(xPix && yPix)) {
      throw createErrorClient(ERRORS_MESSAGES.cellSizeIsTooLarge(cellSize));
    }

    this.image.crop({
      x: 0,
      y: 0,
      w: xPix * cellSize,
      h: yPix * cellSize,
    });

    return { xPix, yPix };
  }

  protected getPixelColor(x: number, y: number) {
    return {
      r: this.image.bitmap.data[this.image.getPixelIndex(x, y)] ?? throwError(),
      g: this.image.bitmap.data[this.image.getPixelIndex(x, y) + 1] ?? throwError(),
      b: this.image.bitmap.data[this.image.getPixelIndex(x, y) + 2] ?? throwError(),
      a: this.image.bitmap.data[this.image.getPixelIndex(x, y) + 3] ?? throwError(),
    };
  }

  private colorPixel(x: number, y: number, color: RGBAColor) {
    this.image.bitmap.data[this.image.getPixelIndex(x, y)] = color.r;
    this.image.bitmap.data[this.image.getPixelIndex(x, y) + 1] = color.g;
    this.image.bitmap.data[this.image.getPixelIndex(x, y) + 2] = color.b;
    this.image.bitmap.data[this.image.getPixelIndex(x, y) + 3] = color.a;
  }

  protected drawRectangle(i: number, j: number, size: number, color: RGBAColor) {
    for (let x: number = 0; x < size; x++) {
      for (let y: number = 0; y < size; y++) {
        this.colorPixel(x + i * size, y + j * size, color);
      }
    }
  }

  get image() {
    if (!this._jimpImage) {
      throw new Error();
    }

    return this._jimpImage;
  }

  set image(value) {
    this._jimpImage = value;
  }
}
