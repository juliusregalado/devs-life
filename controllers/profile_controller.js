const Profile = require('../models/Profile');
const validateProfileInput = require('../validation/profile');
const validateExperienceInput = require('../validation/experience');
const validateEducationInput = require('../validation/education');

module.exports = {

  profileFindOne(req, res) {
    const errors = {};
    Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      console.log('profile finOne(get)--->', profile)
      res.json(profile)
    })
    .catch(err => res.status(404).json(err));
  },

  getAll(req, res) {
    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if(!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors)
      }
      res.json(profiles);
    })
    .catch(err =>
      res.status(404).json({profile: 'there are no profiles'})
    );
  },

  fetchViaHandle(req, res) {
    Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors)
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
    console.log(req.params)
  },

  fetchViaId(req,res) {
    Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors)
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({profile: 'there is no profile for this user'}));
  },

  createProfile(req, res) {
    const { errors, isValid } = validateProfileInput(req.body)
    if(!isValid){
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //skills split into array
    if(typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
    //social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      // if there is profile then update if not then create
      if(profile) {
        Profile.findOneAndUpdate(
          {user: req.user.id},
          {$set: profileFields},
          {new: true}
        )
        .then(profile => {
          res.json(profile)
        })
        console.log('updated profile--->', profile)
      } else {
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          //if handle exist send error
          if(profile) {
            errors.handle = 'The handle already exists';
            res.status(400).json(errors);
          }
          new Profile(profileFields).save()
          .then(profile => {
            res.json(profile)
          })
        })
        console.log('new profile--->', profile)
      }
    })
  },

  addExp(req, res) {
    const { errors, isValid } = validateExperienceInput(req.body)
    if(!isValid){
      return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id}).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.experience.unshift(newExp);
      profile.save().then(profile => {
        res.json(profile)
      });
    })
  },

  addEdu(req, res) {
    const { errors, isValid } = validateEducationInput(req.body)
    if(!isValid){
      return res.status(400).json(errors);
    }
    Profile.findOne({user: req.user.id}).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.education.unshift(newEdu);
      profile.save().then(profile => {
        res.json(profile)
      });
    })
  },

  deleteExp(req, res) {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const removeIndex = profile.experience.map(el => el.id).indexOf(req.params.exp_id);
      console.log('about to delete fr exp-->', profile.experience[removeIndex])
      profile.experience.splice(removeIndex, 1)
      profile.save().then(profile => res.json(profile));
      console.log('fr delete exp-->', profile.experience)
    })
    .catch(err => res.status(404).json(err));
  },

  deleteEdu(req, res) {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const removeIndex = profile.education.map(el => el.id).indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1)
      profile.save().then(profile => res.json(profile));
      console.log('fr delete edu-->', profile.education)
    })
    .catch(err => res.status(404).json(err));
  },

  deleteProfile(req, res) {
    console.log('deleteProfile --->', req.user)
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }

}