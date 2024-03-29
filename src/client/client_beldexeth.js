
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import ClientBase from './client_base';
import aes from '../utils/aes';

class ClientBeldexETH extends ClientBase {

    constructor(web3, beldex, home) {
        super(web3, beldex, home);
    }

    async mint(value, mintGasLimit) {
        var that = this;
        that.checkRegistered();
        that.checkValue();
        var account = that.account;
        value = value * 1e18/that.unit;
        console.log("Initiating mint: value of " + value + " units (" + value * that.unit + " wei)");

        let encGuess = '0x' + aes.encrypt(new BN(account.available()).toString(16), account.aesKey);

        var nativeValue = that.web3.utils.toBN(new BigNumber(value * that.unit)).toString();
        console.log("nativeValue: ",nativeValue);
        if (mintGasLimit === undefined)
            mintGasLimit = 400000;
        let transaction = that.beldex.methods.mint(account.publicKeySerialized(), value, encGuess)
            .send({ from: that.home, value: nativeValue, gas: mintGasLimit })
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

export default ClientBeldexETH;
