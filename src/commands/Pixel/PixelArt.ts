import { MIME_JPEG } from 'jimp';
import { GenericPixelClass } from '@/commands/Pixel/GenericPixelClass';

import { ParameterNumber } from '@/helpers/Parameter';

export class PixelArt extends GenericPixelClass {
  private readonly cellSize: number;

  constructor(filePath: string, commandBody: string) {
    super(filePath);
    this.cellSize = new ParameterNumber('size').getValue(commandBody, 10);
  }

  public async getResult() {
    await this.readBuffer();

    const { xPix, yPix } = this.crop(this.cellSize);

    for (let j: number = 0; j < yPix; j++) {
      for (let i: number = 0; i < xPix; i++) {
        const { x, y } = {
          x: Math.floor(i * this.cellSize + this.cellSize / 2),
          y: Math.floor(j * this.cellSize + this.cellSize / 2),
        };

        this.drawRectangle(i, j, this.cellSize, this.getPixelColor(x, y));
      }
    }

    return {
      caption: `The image with pixels x${this.cellSize} larger than usual`,
      bufferedImage: await this.image.getBufferAsync(MIME_JPEG),
    };
  }
}
