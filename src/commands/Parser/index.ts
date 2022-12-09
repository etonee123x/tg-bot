import 'dotenv-flow/config.js';

import { Buffer } from 'buffer';
import { post, get } from '@/http';

export default class Parser {
  private readonly id = Date.now()

  constructor(private readonly filePath: string) {}

  public async getResult() {
    const downloadFileURL = `https://api.telegram.org/file/bot${process.env.TOKEN}/${this.filePath}`
    const data = await get<Buffer>(downloadFileURL, { responseType: 'arraybuffer' });
    const url = `${String(process.env.API_URL)}/parser`
    const options = { type: 'Buffer', data };
    const result = await post<Buffer>(url, { options, id: this.id }, { maxBodyLength: Infinity, responseType: 'arraybuffer' })
    return {
      result,
      filename: `results-${this.id}.json`
    }
  }
}
