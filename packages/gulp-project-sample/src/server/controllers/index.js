import fs from 'fs';
import path from 'path';

/**
 * show README
 * @param {Request} req request object
 * @param {Response} res response object
 * @return {Promise}
 */
export async function readme(req, res) {
  const filepath = path.resolve(process.cwd(), './README.md'),
        STATUS_NOT_FOUND = 404,
        STATUS_OK = 200;

  const results = await new Promise((resolve) =>
    fs.readFile(filepath, (error, content) => resolve({
      error, content: content ? content.toString() : null
    }))
  );

  if (results.error) {
    res.status(STATUS_NOT_FOUND).send('README.md is not Found.');
    return;
  }

  res.status(STATUS_OK).render('markdown', {
    title: `README`,
    content: results.content
  });
  return;
}
