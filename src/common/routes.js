import React from 'react';
import { Route } from 'react-router';
import App from './containers/app.js';
import Builds from './containers/builds.js';
import BuildDetails from './containers/build-details.js';
import MyRepos from './containers/my-repos.js';
import Landing from './containers/landing.js';
import LoginFailed from './containers/login-failed.js';
import SelectRepositories from './containers/select-repositories.js';
import EnsureLoggedIn from './containers/ensure-logged-in';

export default (
  <Route component={App}>
    <Route path="/" component={Landing}/>
    <Route component={ EnsureLoggedIn }>
      <Route path="/user/:owner" component={MyRepos}/>
      <Route path="/select-repositories" component={SelectRepositories}/>
    </Route>
    <Route path="/:owner/:name/builds" component={Builds}/>
    <Route path="/:owner/:name/builds/:buildId" component={BuildDetails}/>
    <Route path="/login/failed" component={LoginFailed}/>
  </Route>
);
