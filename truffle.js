require('babel-register');
require('babel-polyfill');

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      // gas: 10000000,
      // gasPrice: 0x01,
      from:"0x0113f7841e1d2b55e93d78c090d26230a7de6a23",

      // from: "0x1ab1d852af5f4e0d5f202905ee5047eeefa5b8c3",

    }
  }
};
