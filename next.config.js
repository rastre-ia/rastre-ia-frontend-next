/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals.push('@node-rs/argon2');
		}
		return config;
	},
};

module.exports = nextConfig;
