/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import request from 'request';
import express from 'express';
import expressEngineHandlebars from '../src';

describe('express-engine-handlebars', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    expected: `${__dirname}/fixtures/expected`
  };
  let app = null;

  beforeEach(() => {
    app = express();
    app.set('view engine', 'hbs');
    app.set('views', `${__dirname}/fixtures/src/views`);
  });

  afterEach(() => {
    app = null;
  });

  it('should out internal server error if syntax error.', (done) => {
    app.engine('hbs', expressEngineHandlebars());
    app.get('/syntax-error', (req, res) => {
      res.render('syntax-error', {
        title: 'syntax error test',
        contents: 'syntax error contents'
      });
    });

    const server = app.listen(3000, () => {
      request('http://localhost:3000/syntax-error', (error, response) => {
        const {statusCode} = response;

        assert.equal(statusCode, 500);
        return server.close();
      });
    });

    server.on('close', done);
  });

  it('should out it as is if layout not use.', (done) => {
    app.engine('hbs', expressEngineHandlebars());
    app.get('/no-layout', (req, res) => {
      res.render('no-layout', {
        title: 'no layout test',
        contents: 'no layout contents'
      });
    });

    const server = app.listen(3000, () => {
      request('http://localhost:3000/no-layout', (error, response, body) => {
        const expected = fs.readFileSync(`${path.expected}/no-layout.html`);

        assert.equal(body.toString(), expected.toString());
        return server.close();
      });
    });

    server.on('close', done);
  });

  it('should out applied specified layout if layout use.', (done) => {
    app.engine('hbs', expressEngineHandlebars({
      layouts: `${__dirname}/fixtures/src/views/layouts/**/*.hbs`
    }));
    app.get('/with-layout', (req, res) => {
      res.render('with-layout', {
        title: 'with layout test',
        contents: 'with layout contents'
      });
    });

    const server = app.listen(3000, () => {
      request('http://localhost:3000/with-layout', (error, response, body) => {
        const expected = fs.readFileSync(`${path.expected}/with-layout.html`);

        assert.equal(body.toString(), expected.toString());
        return server.close();
      });
    });

    server.on('close', done);
  });

  it('should out applied specified partial if partial use.', (done) => {
    app.engine('hbs', expressEngineHandlebars({
      partials: `${__dirname}/fixtures/src/views/partials/**/*.hbs`
    }));
    app.get('/with-partial', (req, res) => {
      res.render('with-partial', {
        title: 'with partial test',
        contents: 'with partial contents'
      });
    });

    const server = app.listen(3000, () => {
      request('http://localhost:3000/with-partial', (error, response, body) => {
        const expected = fs.readFileSync(`${path.expected}/with-partial.html`);

        assert.equal(body.toString(), expected.toString());
        return server.close();
      });
    });

    server.on('close', done);
  });

  it('should out applied specified helpers if it default helpers use.', (done) => {
    app.engine('hbs', expressEngineHandlebars());
    app.get('/with-default-helpers', (req, res) => {
      res.render('with-default-helpers', {
        title: 'with default helpers test',
        contents: `
# heading

> with default helpers test.

+ list 1
+ list 2
+ list 3

\`\`\`js
import hoge from 'hoge';

hoge();
\`\`\`
        `
      });
    });

    const server = app.listen(3000, () => {
      request('http://localhost:3000/with-default-helpers', (error, response, body) => {
        const expected = fs.readFileSync(`${path.expected}/with-default-helpers.html`);

        assert.equal(body.toString(), expected.toString());
        return server.close();
      });
    });

    server.on('close', done);
  });

  it('should out applied specified helpers if additinal helpers use.', (done) => {
    app.engine('hbs', expressEngineHandlebars({
      helpers: `${__dirname}/fixtures/src/views/helpers/**/*.js`
    }));
    app.get('/with-additinal-helpers', (req, res) => {
      res.render('with-additinal-helpers', {
        title: 'with additinal helpers test',
        contents: 'with additinal helpers contents'
      });
    });

    const server = app.listen(3000, () => {
      request('http://localhost:3000/with-additinal-helpers', (error, response, body) => {
        const expected = fs.readFileSync(`${path.expected}/with-additinal-helpers.html`);

        assert.equal(body.toString(), expected.toString());
        return server.close();
      });
    });

    server.on('close', done);
  });

});
