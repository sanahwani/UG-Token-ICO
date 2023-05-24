var HDWalletProvider = require(“truffle-hdwallet-provider”);
var mnemonic = “brush unit remember news depth tree gospel differ giraffe exact manage unusual”;
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic,     “https://rinkeby.infura.io/3bc09cc960c64bf48b78ee56196d8a8e");
      },
      network_id: 1
    }
  }
};