module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./scripts/setup.js'],
  transformIgnorePatterns: ['node_modules/(?!(sucrase)/)'],
  roots: ['<rootDir>/projects'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
    '^.+\\.html$': './scripts/jest-html-transformer.js',
  },
};
