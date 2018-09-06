import pkg from '../../../package.json';

/**
 * show project info
 * @param {Request} req request object
 * @param {Response} res response object
 * @return {Promise}
 */
export async function project(req, res) {
  const STATUS_OK = 200;

  res.status(STATUS_OK).json(pkg);
  return;
}
