import * as status from '../constants/statusCode.js';
import { pkg } from '../../../config.js';

/**
 * show project info
 *
 * @param {Request} req request object
 * @param {Response} res response object
 * @return {Promise}
 */
export async function project(req, res) {
  await new Promise((resolve) => {
    res.status(status.OK).json(pkg);
    resolve();
  });
}
