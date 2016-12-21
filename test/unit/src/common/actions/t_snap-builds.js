import expect from 'expect';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { isFSA } from 'flux-standard-action';

import { conf } from '../../../../../src/server/helpers/config';

import {
  fetchBuilds,
  fetchBuildsSuccess,
  fetchBuildsError
} from '../../../../../src/common/actions/snap-builds';
import * as ActionTypes from '../../../../../src/common/actions/snap-builds';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('repository input actions', () => {
  const initialState = {
    isFetching: false,
    builds: [],
    error: false
  };

  let store;
  let action;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  context('fetchBuildsSuccess', () => {
    let payload = [ { build: 'test1' }, { build: 'test2' }];

    beforeEach(() => {
      action = fetchBuildsSuccess(payload);
    });

    it('should create an action to store snap builds', () => {
      const expectedAction = {
        type: ActionTypes.FETCH_BUILDS_SUCCESS,
        payload
      };

      store.dispatch(action);
      expect(store.getActions()).toInclude(expectedAction);
    });

    it('should create a valid flux standard action', () => {
      expect(isFSA(action)).toBe(true);
    });
  });

  context('fetchBuildsError', () => {
    let payload = 'Something went wrong!';

    beforeEach(() => {
      action = fetchBuildsError(payload);
    });

    it('should create an action to store request error on failure', () => {
      const expectedAction = {
        type: ActionTypes.FETCH_BUILDS_ERROR,
        error: true,
        payload
      };

      store.dispatch(action);
      expect(store.getActions()).toInclude(expectedAction);
    });

    it('should create a valid flux standard action', () => {
      expect(isFSA(action)).toBe(true);
    });
  });

  context('fetchBuilds', () => {

    let api;

    beforeEach(() => {
      api = nock(conf.get('BASE_URL'));
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should store builds on fetch success', () => {
      api.get('/api/launchpad/builds')
        .query((query) => query.snap_link) // accept any snap_link in query
        .reply(200, {
          status: 'success',
          payload: {
            code: 'snap-builds-found',
            builds: []
          }
        });

      return store.dispatch(fetchBuilds('foo/bar'))
        .then(() => {
          api.done();
          expect(store.getActions()).toHaveActionOfType(
            ActionTypes.FETCH_BUILDS_SUCCESS
          );
        });
    });

    // TODO: pending - mocked actions never fail
    xit('should store error on Launchpad request failure', () => {
      // return store.dispatch(fetchBuilds('foo/bar'))
      //   .then(() => {
      //     expect(store.getActions()).toHaveActionOfType(
      //       ActionTypes.FETCH_BUILDS_ERROR
      //     );
      //   });
    });

  });

});
