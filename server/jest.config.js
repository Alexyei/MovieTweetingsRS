module.exports = {
    testPathIgnorePatterns: ["src"],
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    testTimeout: 60000
};