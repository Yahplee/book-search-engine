const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id });

				return userData;
			}

			throw new AuthenticationError("Please log in!");
		},
	},
	Mutation: {
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError("Incorrect credentials!");
			}

			const corerctPassword = await user.isCorrectPassword(password);

			if (!corerctPassword) {
				throw new AuthenticationError("Incorrect credentials!");
			}
			const token = signToken(user);
			return { token, user };
		},
		addUser: async (parent, { username, email, password }) => {
			const user = await user.create({ username, email, password });
			const token = signToken(user);

			return { token, user };
		},
		saveBook: async (parent, { bookData }, context) => {
			if (context.user) {
				const userData = await User.findByIdAndUpdate(
					{ _id: context.user._id },
					{ $push: { savedBook: bookData } },
					{ new: true }
				);

				return userData;
			}

			if (!userData) {
				throw new AuthenticationError("Please log in to save!");
			}
		},
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const userData = await User.findByIdAndDelete(
					{ _id: context.user._id },
					{ $pull: { savedBook: bookId } },
					{ new: true }
				);

				return userData;
			}
			if (!userData) {
				throw new AuthenticationError("Please log in to save!");
			}
		},
	},
};

modules.exports = resolvers;
