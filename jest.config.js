// jest.config.js
module.exports = {
	testEnvironment: "node",
	setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js", "<rootDir>/src/tests/cleanup.js"],
	// testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
	testMatch: ["**/src/tests/**/*.test.[jt]s?(x)"],
	coverageDirectory: "coverage",
	collectCoverageFrom: ["**/src/**/*.js"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
}
