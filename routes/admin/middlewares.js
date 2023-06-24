const { validationResult } = require('express-validator');

module.exports = {
  handleErrors(templateFunc, dataCb) {
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (dataCb) {
          data = await dataCb(req); //call the function if callback exist
        }

        return res.send(templateFunc({ errors, ...data })); //pass in data if it isn't undefined
      }

      next();
    };
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin')
    }
    next()
  }
};
