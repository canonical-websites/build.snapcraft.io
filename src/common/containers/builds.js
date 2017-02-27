import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

import BuildHistory from '../components/build-history';
import { Message } from '../components/forms';
import Spinner from '../components/spinner';
import HelpInstallSnap from '../components/help/install-snap';
import { HeadingOne } from '../components/vanilla/heading';

import withRepository from './with-repository';
import { fetchBuilds, fetchSnap } from '../actions/snap-builds';
import { snapBuildsInitialStatus } from '../reducers/snap-builds';

import styles from './container.css';

class Builds extends Component {
  fetchInterval = null

  fetchData({ snap, repository }) {
    if (snap && snap.self_link) {
      this.props.dispatch(fetchBuilds(repository.url, snap.self_link));
    } else if (repository) {
      this.props.dispatch(fetchSnap(repository.url));
    }
  }

  componentDidMount() {
    this.fetchData(this.props);

    this.fetchInterval = setInterval(() => {
      this.fetchData(this.props);
    }, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchInterval);
  }

  componentWillReceiveProps(nextProps) {
    const currentSnap = this.props.snap;
    const nextSnap = nextProps.snap;
    const currentRepository = this.props.repository.fullName;
    const nextRepository = nextProps.repository.fullName;

    if ((currentSnap !== nextSnap) || (currentRepository !== nextRepository)) {
      // if snap or repo changed, fetch new data
      this.fetchData(nextProps);
    }
  }

  render() {
    const { repository, error, snap } = this.props;
    // only show spinner when data is loading for the first time
    const isLoading = this.props.isFetching && !this.props.success;

    return (
      <div className={ styles.container }>
        <Helmet
          title={`${repository.fullName} builds`}
        />
        <HeadingOne>
          <Link to={`/${repository.fullName}/builds`}>{repository.fullName}</Link>
        </HeadingOne>
        <BuildHistory repository={repository} />
        { isLoading &&
          <div className={styles.spinner}><Spinner /></div>
        }
        { error &&
          <Message status='error'>{ error.message || error }</Message>
        }
        { snap &&
          <HelpInstallSnap
            headline='To test this snap on your PC or cloud instance:'
            name={ snap.store_name }
          />
        }
      </div>
    );
  }

}

Builds.propTypes = {
  repository: PropTypes.shape({
    owner: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  isFetching: PropTypes.bool,
  snap: PropTypes.shape({
    self_link: PropTypes.string.isRequired,
    store_name: PropTypes.string.isRequired
  }),
  success: PropTypes.bool,
  error: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const owner = ownProps.params.owner.toLowerCase();
  const name = ownProps.params.name.toLowerCase();
  const fullName = `${owner}/${name}`;
  const repository = state.repository;
  // get builds for given repo from the store or set default empty values
  const repoBuilds = state.snapBuilds[fullName] || snapBuildsInitialStatus;

  return {
    fullName,
    repository,
    ...repoBuilds
  };
};

export default connect(mapStateToProps)(withRepository(Builds));
