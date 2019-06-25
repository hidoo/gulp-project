import pkg from '../../../package.json';
import * as status from '../constants/statusCode';

/**
 * show project info
 * @param {Request} req request object
 * @param {Response} res response object
 * @return {Promise}
 */
export async function project(req, res) {
  res.status(status.OK).json(pkg);
  return;
}
