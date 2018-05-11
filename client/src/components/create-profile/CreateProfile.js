import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import { createProfile } from '../../actions/profile_actions';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubusername: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    };
  };
  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({errors: nextProps.errors})
    };
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    }
    this.props.createProfile(profileData, this.props.history)
  }; 
  handleInput = (e) => {
    // console.log(e.target.value);
    this.setState({[e.target.name]: e.target.value})
  };
  displaySocialInputs = () => {
    this.setState(prevState => ({
      displaySocialInputs: !prevState.displaySocialInputs
    }));
  };
  render() {
    const { errors, displaySocialInputs } = this.state;
    let socialInputs;
    if(displaySocialInputs){
      socialInputs = (
        <div>
          <InputGroup 
            placeholder="Twitter Page URL"
            name="twitter"
            icon="fab fa-twitter"
            onChange={this.handleInput}
            error={errors.twitter}
          />
          <InputGroup 
            placeholder="Facebook Page URL"
            name="facebook"
            icon="fab fa-facebook"
            onChange={this.handleInput}
            error={errors.facebook}
          />
          <InputGroup 
            placeholder="Linkedin Page URL"
            name="linkedin"
            icon="fab fa-linkedin"
            onChange={this.handleInput}
            error={errors.linkedin}
          />
          <InputGroup 
            placeholder="Youtube Profile URL"
            name="youtube"
            icon="fab fa-youtube"
            onChange={this.handleInput}
            error={errors.youtube}
          />
          <InputGroup 
            placeholder="Instagram Profile URL"
            name="instagram"
            icon="fab fa-instagram"
            onChange={this.handleInput}
            error={errors.instagram}
          />
        </div>
      )
    }
    const options = [
      {label: '* Select Professional Status',value: 0},
      {label: 'Junior Developer',value: 'Junior Developer'},
      {label: 'Senior Developer',value: 'Senior Developer'},
      {label: 'Manager',value: 'Manager'},
      {label: 'Student',value: 'Student'},
      {label: 'Instructor',value: 'Instructor'},
      {label: 'Intern',value: 'Intern'},
      {label: 'Freelancer',value: 'Freelancer'},
      {label: 'Other',value: 'Other'}
    ];
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Let's get some information to make your profile stand out
              </p>
              <small className="d-block pb-2">* = required fields</small>
              <form onSubmit={this.handleSubmit}>
                <TextFieldGroup 
                  placeholder="* Profile Handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.handleInput}
                  error={errors.handle}
                  info="A unique handle for your profile URL. Your full name, company name, nickname"
                />
                <SelectListGroup 
                  placeholder="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.handleInput}
                  options={options}
                  error={errors.status}
                  info="Give us an idea of where you are at in your career"
                />
                <TextFieldGroup 
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.handleInput}
                  error={errors.company}
                  info="Could be your own company or one you work for"
                />
                 <TextFieldGroup 
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={this.handleInput}
                  error={errors.website}
                  info="Could be your own website or a company one (http:// or https://)"
                />
                 <TextFieldGroup 
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.handleInput}
                  error={errors.location}
                  info="City & State suggested (eg. New York, NY)"
                />
                 <TextFieldGroup 
                  placeholder="* Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.handleInput}
                  error={errors.skills}
                  info="Please use coma separated values (eg. HTML, CSS, Javascript)"
                />
                 <TextFieldGroup 
                  placeholder="Github Username"
                  name="githubusername"
                  value={this.state.githubusername}
                  onChange={this.handleInput}
                  error={errors.githubusername}
                  info="If you want your latest repos and a Github Link, include your github username"
                />
                 <TextAreaFieldGroup 
                  placeholder="Summary"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.handleInput}
                  error={errors.bio}
                  info="Tell us a little about yourself"
                />
                <div className="mb-3">
                  <button 
                  type="button"
                  onClick={this.displaySocialInputs}
                  className="btn btn-light"
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}
                <input 
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(mapStateToProps, { createProfile })(withRouter(CreateProfile))