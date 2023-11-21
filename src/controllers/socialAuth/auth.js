// authController.js
import passport from 'passport';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

export const googleAuthCallback = passport.authenticate('google', {
  failureRedirect: '/login',
});

export const googleAuthCallbackRedirect = (req, res) => {
  // Successful authentication, redirect to the home page or another route
  res.redirect('/profile');
};
