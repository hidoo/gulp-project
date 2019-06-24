import fs from 'fs';
import path from 'path';
import * as status from '../constants/statusCode';

/**
 * show README
 * @param {Request} req request object
 * @param {Response} res response object
 * @return {Promise}
 */
export async function readme(req, res) {
  const filepath = path.resolve(process.cwd(), './README.md');

  const results = await new Promise((resolve) =>
    fs.readFile(filepath, (error, content) => resolve({
      error, content: content ? content.toString() : null
    }))
  );

  if (results.error) {
    res.status(status.NOT_FOUND).send('README.md is not Found.');
    return;
  }

  res.status(status.OK).render('markdown', {
    title: `README`,
    content: results.content
  });
  return;
}
