import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import sinon from 'sinon';

import { CALL_API } from '../../../../../src/common/middleware/call-api';
import callApi from '../../../../../src/common/middleware/call-api';

const CSRF_TOKEN = 'blah';
const middlewares = [ thunk,  callApi({ endpoint: 'http://localhost:8000', csrfToken: 'blah' })];
const mockStore = configureMockStore(middlewares);

describe('The callApi middleware', () => {
  let store;
  let api;

  beforeEach(() => {
    store = mockStore();
    api = nock('http://localhost:8000');
  });

  context('when response is 200 okay', () => {
    const RESPONSE_CODE = 200;
    const RESPONSE = {
      status: 'success',
      payload: {
        code: 'snaps-found',
        repos: []
      }
    };

    beforeEach(() => {
      api.get('/path')
        .reply(RESPONSE_CODE, RESPONSE);
    });

    afterEach(() => {
      api.done();
      nock.cleanAll();
    });

    context('and action invoking [CALL_API] is dispatched', () => {
      let action;
      const PAYLOAD = {
        id: 3
      };

      beforeEach(() => {
        action = {
          payload: PAYLOAD,
          [CALL_API]: {
            path: '/path',
            types: [ 'EXAMPLE_ACTION', 'EXAMPLE_ACTION_SUCCESS', 'EXAMPLE_ACTION_ERROR' ],
            options: {
              headers: { 'Content-Type': 'application/json' }
            }
          }
        };
        sinon.spy(global, 'fetch');
      });

      afterEach(() => {
        global.fetch.restore();
      });

      it('should dispatch EXAMPLE_ACTION', async () => {
        await store.dispatch(action);
        expect(store.getActions()).toHaveActionOfType('EXAMPLE_ACTION');
      });

      it('should dispatch EXAMPLE_ACTION_SUCCESS', async () => {
        await store.dispatch(action);
        expect(store.getActions()).toHaveActionOfType('EXAMPLE_ACTION_SUCCESS');
      });

      it('should dispatch EXAMPLE_ACTION_SUCCESS with a payload containing fetched response', async () => {
        await store.dispatch(action);
        expect(store.getActions()).toHaveActionsMatching((action) => {
          return JSON.stringify(action.payload.response) === JSON.stringify(RESPONSE);
        });
      });

      it('should remove all [CALL_API] settings from dispatched actions', async () => {
        await store.dispatch(action);
        expect(store.getActions()).toNotHaveActionsMatching((action) => !!action[CALL_API]);
      });

      it('should call fetch and supply any options passed', async () => {
        await store.dispatch(action);
        expect(sinon.assert.calledWithMatch(
          global.fetch,
          'http://localhost:8000/path',
          (options) => {
            return JSON.stringify(options.headers) === JSON.stringify(action[CALL_API].options.headers);
          }
        ));
      });

      it('should call fetch and supply a valid CSRF token', async () => {
        await store.dispatch(action);
        expect(sinon.assert.calledWithMatch(
          global.fetch,
          'http://localhost:8000/path',
          (options) => {
            return options.headers['X-CSRF-Token'] === CSRF_TOKEN;
          }
        ));
      });
    });
  });

  context('when response is 500 error', () => {
    const RESPONSE_CODE = 500;
    const RESPONSE = {
      status: 'error',
      payload: {
        code: 'lp-error',
        message: 'Something went wrong'
      }
    };

    beforeEach(() => {
      api.get('/path')
        .reply(RESPONSE_CODE, RESPONSE);
    });

    afterEach(() => {
      api.done();
      nock.cleanAll();
    });

    context('and action invoking [CALL_API] is dispatched', () => {
      let action;
      const PAYLOAD = {
        id: 3
      };

      beforeEach(() => {
        action = {
          payload: PAYLOAD,
          [CALL_API]: {
            path: '/path',
            types: [ 'EXAMPLE_ACTION', 'EXAMPLE_ACTION_SUCCESS', 'EXAMPLE_ACTION_ERROR' ],
            options: {
              headers: { 'Content-Type': 'application/json' }
            }
          }
        };
      });

      it('should dispatch EXAMPLE_ACTION', async () => {
        await store.dispatch(action);
        expect(store.getActions()).toHaveActionOfType('EXAMPLE_ACTION');
      });

      it('should dispatch EXAMPLE_ACTION_ERROR', async () => {
        await store.dispatch(action);
        expect(store.getActions()).toHaveActionOfType('EXAMPLE_ACTION_ERROR');
      });

      it('should dispatch EXAMPLE_ACTION_SUCCESS with a payload containing fetched response', async () => {
        await store.dispatch(action);
        expect(store.getActions()).toHaveActionsMatching((action) => {
          return action.payload.error && action.payload.error.message === RESPONSE.payload.message;
        });
      });
    });
  });
});
