var disperse = artifacts.require("./disperse.sol");
var RTOK = artifacts.require("./RTOK.sol");
const BN = require('bn.js');
const div = Math.pow(10, 18);

contract("Disperse Test" , async accounts => {
    it("Disperse RTOK to three accounts", async () => {
        let instance = await disperse.deployed();
        let token = await RTOK.deployed();
        let init1 = await token.balanceOf(accounts[1]);
        let init2 = await token.balanceOf(accounts[2]);
        let init3 = await token.balanceOf(accounts[3]); 
        
        let disperseTo = [accounts[1],accounts[2],accounts[3]];

        let amount1 = "10000000000000000000";
        let amount2 = "20000000000000000000";
        let amount3 = "30000000000000000000";
        let total = "60000000000000000000";

        let disperseValues = [amount1, amount2,amount3];

        token.approve(instance.address,total);

        //Estimate Gas

        //let result = await instance.disperseToken.estimateGas(token.address,disperseTo,disperseValues,{from: accounts[0]});

        //console.log(result);

        await instance.disperseToken(token.address,disperseTo,disperseValues,{from: accounts[0]});

        assert.equal((await token.balanceOf(accounts[1])).sub(init1).toString(),"10000000000000000000");
        assert.equal((await token.balanceOf(accounts[2])).sub(init2).toString(),"20000000000000000000");
        assert.equal((await token.balanceOf(accounts[3])).sub(init3).toString(),"30000000000000000000");
    })

    it("Disperse RTOK to three accounts. Simple Version", async () => {
        let instance = await disperse.deployed();
        let token = await RTOK.deployed();
        let init1 = await token.balanceOf(accounts[1]);
        let init2 = await token.balanceOf(accounts[2]);
        let init3 = await token.balanceOf(accounts[3]);

        let disperseTo = [accounts[1],accounts[2],accounts[3]];

        let amount1 = "10000000000000000000";
        let amount2 = "20000000000000000000";
        let amount3 = "30000000000000000000";
        let total = "60000000000000000000";

        let disperseValues = [amount1, amount2,amount3];

        token.approve(instance.address,total);

        //Estimate Gas

        //let result = await instance.disperseTokenSimple.estimateGas(token.address,disperseTo,disperseValues,{from: accounts[0]});

        //console.log(result);

        await instance.disperseTokenSimple(token.address,disperseTo,disperseValues,{from: accounts[0]});

        assert.equal((await token.balanceOf(accounts[1])).sub(init1).toString(),"10000000000000000000");
        assert.equal((await token.balanceOf(accounts[2])).sub(init2).toString(),"20000000000000000000");
        assert.equal((await token.balanceOf(accounts[3])).sub(init3).toString(),"30000000000000000000");
    })

    it("Disperse ether to three accounts.", async () => {
        let instance = await disperse.deployed();
        let init1 = await web3.eth.getBalance(accounts[1]);
        let init2 = await web3.eth.getBalance(accounts[2]);
        let init3 = await web3.eth.getBalance(accounts[3]);

        let disperseTo = [accounts[1],accounts[2],accounts[3]];

        let amount1 = "1000000000000000000";
        let amount2 = "2000000000000000000";
        let amount3 = "3000000000000000000";
        let total = "6000000000000000000";

        let disperseValues = [amount1, amount2,amount3];

        
        let result = await instance.disperseEther(disperseTo,disperseValues,{from: accounts[0],value: total});

        //console.log(result);
        let final1 = await web3.eth.getBalance(accounts[1]);
        let final2 = await web3.eth.getBalance(accounts[2]);
        let final3 = await web3.eth.getBalance(accounts[3]);

        assert.equal((new BN(final1,10)).sub(new BN(init1,10)).toString(),"1000000000000000000");
        assert.equal((new BN(final2,10)).sub(new BN(init2,10)).toString(),"2000000000000000000");
        assert.equal((new BN(final3,10)).sub(new BN(init3,10)).toString(),"3000000000000000000");
    })
})