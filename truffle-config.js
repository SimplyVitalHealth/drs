module.exports = {
  migrations_directory: "./migrations",
  networks: {
     solc: { optimizer: { enabled: true, runs: 200 } },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      //from: "0x1ab1d852af5f4e0d5f202905ee5047eeefa5b8c3",
      from:"0xfcbc080dd4b5aafcea9e35cccf3e2e5746d90935",
    //  gas: 4712388


    }
  }
};
