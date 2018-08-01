require('babel-register');
require('babel-polyfill');

module.exports = {
  migrations_directory: "./migrations",
  solc: { optimizer: { enabled: true, runs: 200 } },
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      //from: "0x79cc456feb34cdc4af9c1281ee4be62940a215f5",
      gas: 4712388   
    }
  }
};
