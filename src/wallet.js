
import crypto from 'crypto'

import bip39 from 'bip39'
import arkjs from 'arkjs'
import request from 'request'

var callback = function(error, response, body) {
    console.log(error || body);
  };


angular.module('wallet', [])
  .factory('wallet', () => {

    return {
      mnemonicToData: (passphrase) => {
        if (!passphrase) {
          passphrase = bip39.generateMnemonic()
        }

        let networks = arkjs.networks
        let ecpair = arkjs.ECPair.fromSeed(passphrase, networks.dark)

        let publicKey = ecpair.getPublicKeyBuffer().toString('hex')
        let address = ecpair.getAddress().toString('hex')
        let wif = ecpair.toWIF()

        var amount      = 50 * Math.pow(10, 8); 
        arkjs.crypto.setNetworkVersion(30)
        var transaction = arkjs.transaction.createTransaction(address, amount, "DARK paper wallet - now start coding:)", "post throw venue dove boss mule amount pencil coach crisp purpose slice", "");
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        const url = "http://104.238.165.129:4002/peer/transactions"; 
        request({
          url: proxyurl + url,
          json: { transactions: [transaction] },
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'os': 'linux3.2.0-4-amd64',
            'version': '0.3.0',
            'port': 4002,
            'nethash': "578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23"
          }
        }, callback);
  

        return {
          passphrase,
          passphraseqr: '{"passphrase":"'+passphrase+'"}',
          address: address,
          addressqr: '{"a":"'+address+'"}',
          publicKey: publicKey,
          wif: wif,
          entropy: bip39.mnemonicToEntropy(passphrase),
          seed: bip39.mnemonicToSeedHex(passphrase),
        }
      },
      validateMnemonic: (mnemonic) => {
        return bip39.validateMnemonic(mnemonic)
      },
      randomBytes: crypto.randomBytes,
      entropyToMnemonic: bip39.entropyToMnemonic
    }
  })
