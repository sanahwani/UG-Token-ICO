var UGToken= artifacts.require("./UGToken.sol");
var UGTokenSale= artifacts.require("./UGTokenSale.sol");


module.exports = function(deployer) {
	deployer.deploy(UGToken,1000000).then(function(){ // RETURNS PROMISE
		var tokenPrice="1000000000000000"; //=0.001 ether, each UGToken will cost 0.001 ether

		return deployer.deploy(UGTokenSale, UGToken.address, tokenPrice);
	});
	
};