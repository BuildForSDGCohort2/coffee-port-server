const { combineResolvers } = require('graphql-resolvers');
const { isAuthenitcated, isverified } = require('./authorization');
const { sendReportMail } = require('../util/sendmail');

module.exports = {
  Query: {
    report: async (_, { id }, { models: { Report } }) => {
      try {
        const report = await Report.findById(id);
        return {
          __typename: 'Report',
          ...report._doc,
          id: report.id,
        };
      } catch (err) {
        return {
          __typename: 'ReportDoesNotExist',
          message: 'Report does not exist',
          type: `${err}`,
        };
      }
    },
    reports: async (_, __, { models: { Report } }) => {
      try {
        const reports = await Report.find();
        return {
          __typename: 'Reports',
          reports,
        };
      } catch (err) {
        return {
          __typename: 'ReportsDoesNotExist',
          message: 'There are no reports',
          type: `${err}`,
        };
      }
    },
  },

  Mutation: {
    reportUsers: combineResolvers(
      isAuthenitcated,
      isverified,
      async (_, { reportedUser: { id }, reportMessage },
        { models: { User, Report }, currentUser }) => {
        try {
          const emails = [];
          const user = await User.findById(id);
          const admins = await User.find({ role: 'ADMIN' });
          admins.forEach((admin) => {
            emails.push(admin.email);
          });
          const report = new Report({
            reportMessage,
            reportedUser: user.id,
            reporterUser: currentUser.id,
          });
          const res = await report.save();
          const data = {
            emails,
            user,
            currentUser,
            reportMessage,
          };
          sendReportMail(data);
          return {
            __typename: 'Reported',
            report: res,
            result: `you're report has been sent to admins, you reported user ${user.email}`,
          };
        } catch (err) {
          return {
            __typename: 'UserDoesNotExist',
            message: 'Error getting user',
            type: `${err}`,
          };
        }
      },
    ),
  },
};
