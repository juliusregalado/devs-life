import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profile_actions';

class Experience extends Component {
  handleDelete = (id) => {
    this.props.deleteExperience(id)
  }
  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="YYYY/MM">{exp.from}</Moment> -{' '}
          {exp.to===null ? ('Current') : (<Moment format="YYYY/MM">{exp.to}</Moment> )}
        </td>
        <td><button onClick={this.handleDelete} className="btn btn-sm btn-danger">Delete</button></td>
      </tr>
    ))
    return (
      <div>
        <h4 className="mb-4">Experience</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th></th>
            </tr>
            {experience}
          </thead>
        </table>
      </div>
    )
  }
}
Experience.propTypes = {
  deleteExperience:  PropTypes.func.isRequired
}
export default connect(null, { deleteExperience })(Experience);