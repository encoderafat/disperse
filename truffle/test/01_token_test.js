var RTOK = artifacts.require("./RTOK.sol");
const div = Math.pow(10, 18);

contract("RTOK test" , async accounts => {
    it("First account has all the balance", async () => {
        let instance = await RTOK.deployed();
        let tokenSupply = await instance.totalSupply.call();
        tokenSupply = tokenSupply / div;
        let balance = await instance.balanceOf(accounts[0]);
        balance = balance / div;
        assert.equal(tokenSupply,balance,"All Tokens are owned by the owner");
    })

    it("Second account has zero balance", async () => {
        let instance = await RTOK.deployed();
        let balance = await instance.balanceOf(accounts[1]);
        balance = balance / div;
        assert.equal(0,balance,"Second Account doesn't have any tokens");
    })

    it("Check For Successful Transfer", async() => {
        let instance = await RTOK.deployed();
        // get initial balances of accounts 1 and 2
        let balance_init_one = await instance.balanceOf(accounts[0]);

        let balance_init_two = await instance.balanceOf(accounts[1]);

        // Transfer Tokens from account 1 to 2

        let txamount = "1000000000000000000000";

        await instance.transfer(accounts[1],txamount, {from: accounts[0]});

        // get final balances of accounts 1 and 2
        let balance_final_one = await instance.balanceOf(accounts[0]);

        let balance_final_two = await instance.balanceOf(accounts[1]);

        assert.equal(balance_final_one.toString(),"9999000000000000000000000","First Account transfer failed");
        assert.equal(balance_final_two.toString(),"1000000000000000000000","Second Account transfer failed");
    })
})