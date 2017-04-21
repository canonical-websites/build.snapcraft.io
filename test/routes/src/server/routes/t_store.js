import expect from 'expect';
import Express from 'express';
import nock from 'nock';
import supertest from 'supertest';

import store from '../../../../../src/server/routes/store';
import { conf } from '../../../../../src/server/helpers/config';

describe('The store API endpoint', () => {
  const app = Express();
  app.use(store);

  describe('GET account route', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('passes request through to store', (done) => {
      const scope = nock(conf.get('STORE_API_URL'))
        .get('/account')
        .matchHeader(
          'Authorization',
          'Macaroon root="dummy-root", discharge="dummy-discharge"'
        )
        .reply(200, { account_id: 'test-account-id' });

      supertest(app)
        .get('/store/account')
        .query({
          root: 'dummy-root',
          discharge: 'dummy-discharge'
        })
        .expect((res) => {
          scope.done();
          expect(res.status).toBe(200);
          expect(res.body).toEqual({ account_id: 'test-account-id' });
        })
        .end(done);
    });

    it('handles error responses reasonably', (done) => {
      const error = {
        code: 'user-not-ready',
        message: 'Developer has not signed agreement.'
      };
      const scope = nock(conf.get('STORE_API_URL'))
        .get('/account')
        .matchHeader(
          'Authorization',
          'Macaroon root="dummy-root", discharge="dummy-discharge"'
        )
        .reply(403, { error_list: [error] });

      supertest(app)
        .get('/store/account')
        .query({
          root: 'dummy-root',
          discharge: 'dummy-discharge'
        })
        .expect((res) => {
          scope.done();
          expect(res.status).toBe(403);
          expect(res.body).toEqual({ error_list: [error] });
        })
        .end(done);
    });
  });

  describe('sign agreement route', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('passes request through to store', (done) => {
      const scope = nock(conf.get('STORE_API_URL'))
        .post('/agreement/', { latest_tos_accepted: true })
        .matchHeader(
          'Authorization',
          'Macaroon root="dummy-root", discharge="dummy-discharge"'
        )
        .reply(200, { latest_tos_accepted: true });

      supertest(app)
        .post('/store/agreement')
        .send({
          latest_tos_accepted: true,
          root: 'dummy-root',
          discharge: 'dummy-discharge'
        })
        .expect((res) => {
          scope.done();
          expect(res.status).toBe(200);
          expect(res.body).toEqual({ latest_tos_accepted: true });
        })
        .end(done);
    });

    it('handles error responses reasonably', (done) => {
      const error = {
        code: 'bad-request',
        message: '`latest_tos_accepted` must be `true`'
      };
      const scope = nock(conf.get('STORE_API_URL'))
        .post('/agreement/', { latest_tos_accepted: false })
        .matchHeader(
          'Authorization',
          'Macaroon root="dummy-root", discharge="dummy-discharge"'
        )
        .reply(400, { error_list: [error] });

      supertest(app)
        .post('/store/agreement')
        .send({
          latest_tos_accepted: false,
          root: 'dummy-root',
          discharge: 'dummy-discharge'
        })
        .expect((res) => {
          scope.done();
          expect(res.status).toBe(400);
          expect(res.body).toEqual({ error_list: [error] });
        })
        .end(done);
    });
  });
});
