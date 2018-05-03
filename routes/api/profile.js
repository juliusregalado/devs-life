const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const profile_controller = require('../../controllers/profile_controller');

// @route   GET api/profile
// @desc    Get current users' profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), profile_controller.profileFindOne );

// @route   GET api/profile/profile/all
// @desc    Get All Profile
// @access  Public
router.get('/all', profile_controller.getAll );

// @route   GET api/profile/handle/:handle
// @desc    Get Profile by handle
// @access  Public
router.get('/handle/:handle', profile_controller.fetchViaHandle );

// @route   GET api/profile/user/:user_id
// @desc    Get Profile by id
// @access  Public
router.get('/user/:user_id', profile_controller.fetchViaId );

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), profile_controller.createProfile );

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), profile_controller.addExp );

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), profile_controller.addEdu );

// @route   DELETE api/profile/experience/:id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), profile_controller.deleteExp );

// @route   DELETE api/profile/education/:id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), profile_controller.deleteEdu );

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), profile_controller.deleteProfile );

module.exports = router;
