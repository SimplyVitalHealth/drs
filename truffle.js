require('babel-register');
require('babel-polyfill');

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
     host: "localhost", // Connect to geth on the specified
     port: 8545,
     from: "0x6057982d1eb8a4902bf49b6a68d526e27f4be088", // default address to use for any transaction Truffle makes during migrations
     network_id: 4,
     gas: 6612388 // Gas limit used for deploys
   }

  }
};
