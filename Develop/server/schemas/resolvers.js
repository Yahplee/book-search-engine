const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
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
	},
};
