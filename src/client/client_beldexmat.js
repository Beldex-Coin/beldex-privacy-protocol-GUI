
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import ClientBase from './client_base';
import aes from '../utils/aes';

class ClientBeldexMAT extends ClientBase {

    constructor(web3, beldex, home) {
        console.log('web3',web3.version)
        super(web3, beldex, home);
        this.txMintHash='da...'
    }

    async mint (value, mintGasLimit) {
        var that = this;
        that.checkRegistered();
        that.checkValue();
        // that.txData = 'da...'
        var account = that.account;
        console.log("Initiating mint: value of " + value + " units (" + value * that.unit + " wei)");

        let encGuess = '0x' + aes.encrypt(new BN(account.available()).toString(16), account.aesKey);

        var nativeValue = that.web3.utils.toBN(new BigNumber(value * that.unit)).toString();
        if (mintGasLimit === undefined)
            mintGasLimit = 400000;
        localStorage.removeItem('mint_tx_hash')
        let transaction = that.beldex.methods.mint(account.publicKeySerialized(), value, encGuess)
            .send({from: that.home, value: nativeValue, gas: mintGasLimit})
            .on('transactionHash', (hash) => {
                console.log("Mint submitted (txHash = \"" + hash + "\").");
                localStorage.setItem('mint_tx_hash',hash)
                // return that.txMintHash = hash;
            })
            .on('receipt', async (receipt) => {
                account._state = await account.update();
                account._state.pending += parseInt(value);
                console.log("Mint of " + value + " was successful (uses gas: " + receipt["gasUsed"] + ")");
                console.log("Account state: available = ", that.account.available(), ", pending = ", that.account.pending(), ", lastRollOver = ", that.account.lastRollOver()

                );
            })
            .on('error', (error) => {
                console.log("Mint failed: ", error);
                return error;
            });
            // console.log('that txndata', that.txMintHash)
        return transaction;
    }

}

export default ClientBeldexMAT;
