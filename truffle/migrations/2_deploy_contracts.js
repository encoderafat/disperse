const rtok = artifacts.require("./RTOK.sol");
var disperse = artifacts.require("./disperse.sol");

module.exports = function(deployer) {
  deployer.deploy(rtok,"10000000000000000000000000");
  deployer.deploy(disperse);
};
