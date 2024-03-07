import util from 'node:util';
import log from 'fancy-log';

// tweaks log date color like gulp log
util.inspect.styles.date = 'grey';

export default log;
