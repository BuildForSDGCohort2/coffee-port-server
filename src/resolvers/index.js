const userResolvers = require('./user.js');
// module.exports = {
//   Query: { ...userResolvers.Query },
// };

module.exports = [userResolvers];
