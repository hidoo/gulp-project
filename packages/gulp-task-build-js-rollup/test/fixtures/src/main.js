/* eslint max-classes-per-file: off */
import esModule from './modules/esm';
import commonJsModule from './modules/cjs';

esModule();
commonJsModule();

class Es2015Class {
  constructor() {
    this.name = 'es2015-class';
  }

  print() {
    console.log(this.name); // eslint-disable-line no-console
  }
}

class ChildEs2015Class extends Es2015Class {
  constructor() {
    super();
    this.name = 'child-es2015-class';
  }
}

const child = new ChildEs2015Class();

child.print();
