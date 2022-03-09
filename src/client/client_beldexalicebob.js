
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import ClientBase from './client_base';
import aes from '../utils/aes';

class ClientBeldexAlicebob extends ClientBase {

    constructor(web3, beldex, home, alice) {
        super(web3, beldex, home);
        if (alice === undefined)
            throw "4th arg should be an ERC20 contract.";

        // console.log("ERC20 contract: " + alice.options.address);

        this.alice = alice;
    }

    async mint (value, approveGasLimit, mintGasLimit) {
        var that = this;
        that.checkRegistered();
        that.checkValue();
        var account = that.account;
        console.log("Initiating mint: value of " + value + " units (" + value * that.unit + " tokens)");
        var nativeValue = that.web3.utils.toBN(new BigNumber(value * that.unit)).toString();
        if (approveGasLimit === undefined)
            approveGasLimit = 60000;

        var allowance =  await that.alice.methods.allowance(that.home, that.beldex.options.address).call();
        if(allowance < nativeValue) {
          await that.alice.methods.approve(that.beldex.options.address, nativeValue)
          .send({from: that.home, gas: approveGasLimit});
        }
        console.log("ERC20 tokens approved. Start mint...");

        let encGuess = '0x' + aes.encrypt(new BN(account.available()).toString(16), account.aesKey);

        if (mintGasLimit === undefined)
            mintGasLimit = 400000;
        let transaction = that.beldex.methods.mint(account.publicKeySerialized(), value, encGuess)
            .send({from: that.home, gas: mintGasLimit})
            .on('transactionHash', (hash) => {
                console.log("Mint submitted (txHash = \"" + hash + "\").");
            })
            .on('receipt', async (receipt) => {
                account._state = await account.update();
                account._state.pending += parseInt(value);
                console.log("Mint of " + value + " was successful (uses gas: " + receipt["gasUsed"] + ")");
                console.log("Account state: available = ", that.account.available(), ", pending = ", that.account.pending(), ", lastRollOver = ", that.account.lastRollOver());
            })
            .on('error', (error) => {
                console.log("Mint failed: " + error);
            });
        return transaction;
    }
}
export default ClientBeldexAlicebob;
