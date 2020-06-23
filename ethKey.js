import Web3 from "web3";

const web3 = new Web3();

const privatekey = "0xE97FBC95588CCE7606F14B16F652FEFE7F35320A4311439499921228F8A3F783";
const account = web3.eth.accounts.privateKeyToAccount(privatekey);

console.log(account);