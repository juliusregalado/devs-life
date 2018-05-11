import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile_actions';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';
import Experience from './Experience';
import Education from './Education';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  handleDelete = (e) => {
    this.props.deleteAccount();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let dashboardContent;
    if(profile === null || loading) {
      dashboardContent = <Spinner />
    } else {
      // If user has profile display this
      if(Object.keys(profile).length > 0) {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link></p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div style={{marginBottom:'60px'}} />
            <button onClick={this.handleDelete} className="btn btn-danger">
              Delte My Account
            </button>
          </div>
        )
      // If user has no profile display this
      } else {
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not set up a profile, please add some info</p>
            <Link to='/create-profile' className='btn btn-lg btn-info'>
              Create Profile
            </Link>
          </div>
        )
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className='display-5'>Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
Dashboard.proptypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth
})
export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
