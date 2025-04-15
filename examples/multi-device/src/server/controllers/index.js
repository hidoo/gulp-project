import fs from 'node:fs/promises';
import path from 'node:path';
import * as status from '../constants/statusCode.js';

/**
 * show README
 *
 * @param {Request} req request object
 * @param {Response} res response object
 * @return {Promise}
 */
export async function readme(req, res) {
  const filepath = path.resolve(process.cwd(), './README.md');

  try {
    const content = await fs.readFile(filepath);

    res.status(status.OK).render('markdown', {
      title: `README`,
      content: content.toString()
    });
  } catch (error) {
    res
      .status(status.NOT_FOUND)
      .send(`README.md is not Found: ${error.message}`);
  }
}
