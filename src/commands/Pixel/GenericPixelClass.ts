import { Buffer } from 'buffer';
import Jimp from 'jimp';
import GenericCommand from '@commands/GenericCommand';
import type { CommandParams } from '@/types';
import KnownError from '@/helpers/KnownError';
import { get } from '@/http';

import 'dotenv-flow/config.js';

interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
};

const _ERRORS_MESSAGES = {
  cellSizeIsTooLarge: (cellSize: number) =>
    `This image is too small to pixelizate it with x${cellSize} cell size, try to decrease (--size)`,
}

export default class GenericPixelClass extends GenericCommand {
  private _jimpImage?: Jimp;

  constructor(private readonly filePath: string, params: CommandParams, commandBody?: string) {
    super(params, commandBody);
  }

  protected async readBuffer() {
    const url = `https://api.telegram.org/file/bot${process.env.TOKEN}/${this.filePath}`
    const response = await get<Buffer>(url, { responseType: 'arraybuffer' })
    this.image = await Jimp.read(response)
  }

  protected crop(cellSize: number) {
    const xPix = Math.floor(this.image.getWidth() / cellSize);
    const yPix = Math.floor(this.image.getHeight() / cellSize);
    if (!(xPix && yPix)) {
      throw new KnownError(_ERRORS_MESSAGES.cellSizeIsTooLarge(cellSize));
    }

    this.image.crop(0, 0, xPix * cellSize, yPix * cellSize);
    return { xPix, yPix }
  }

  protected getPixelColor(x: number, y: number) {
    return {
      r: this.image.bitmap.data[this.image.getPixelIndex(x, y)],
      g: this.image.bitmap.data[this.image.getPixelIndex(x, y) + 1],
      b: this.image.bitmap.data[this.image.getPixelIndex(x, y) + 2],
      a: this.image.bitmap.data[this.image.getPixelIndex(x, y) + 3],
    };
  }

  private colorPixel(x: number, y: number, color: RGBAColor) {
    this.image.bitmap.data[this.image.getPixelIndex(x, y)] = color.r;
    this.image.bitmap.data[this.image.getPixelIndex(x, y) + 1] = color.g;
    this.image.bitmap.data[this.image.getPixelIndex(x, y) + 2] = color.b;
    this.image.bitmap.data[this.image.getPixelIndex(x, y) + 3] = color.a;
  }

  protected drawRectangle(i: number, j: number, size: number, color: RGBAColor) {
    for (let x: number = 0; x < size; x++)
      for (let y: number = 0; y < size; y++) {
        this.colorPixel(x + i * size, y + j * size, color);
      }
  }

  get image () {
    if (!this._jimpImage) {
      throw new Error()
    }
    return this._jimpImage
  }

  set image (value) {
    this._jimpImage = value
  }
};
