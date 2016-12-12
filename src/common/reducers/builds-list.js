const initialState = {
  isFetching: false,
  builds: []
};

initialState.builds = [{
  buildId: '1235',
  username: 'John Doe',
  commitId:  'c196edb',
  commitMessage:  'Current commit',
  architecture: 'i386',
  status:  'pending',
  statusMessage: 'Currently building',
  dateStarted: '2016-12-01T17:08:36.317805+00:00',
  dateCompleted: null,
  duration: '0:02:36.314039'
},{
  buildId: '1234',
  username: 'John Doe',
  commitId:  'a196edb',
  commitMessage:  'Awesome commit',
  architecture: 'i386',
  status:  'success',
  statusMessage: 'Completed',
  dateStarted: '2016-12-01T17:08:36.317805+00:00',
  dateCompleted: '2016-12-01T17:15:36.317805+00:00',
  duration: '0:07:36.314039'
},{
  buildId: '1233',
  username: 'John Doe',
  commitId:  'a1d6edb',
  commitMessage:  'Other commit',
  architecture: 'i386',
  status:  'success',
  statusMessage: 'Completed',
  dateStarted: '2016-12-01T17:08:36.317805+00:00',
  dateCompleted: '2016-12-01T17:09:36.317805+00:00',
  duration: '0:01:00.124039'
},{
  buildId: '1232',
  username: 'John Doe',
  commitId:  'f1d6edb',
  commitMessage:  'Failed commit',
  architecture: 'i386',
  status:  'error',
  statusMessage: 'Failed to build',
  dateStarted: '2016-12-01T17:08:36.317805+00:00',
  dateCompleted: '2016-12-01T17:10:36.317805+00:00',
  duration: '0:02:00.124039'
}];

export function buildsList(state = initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}
