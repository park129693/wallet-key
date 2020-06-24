//2020.06.24
import key from "./key.js";
import cryto from "crypto";
import createKaccakHach from "keccak";
import secp256k1 from "secp256k1";
import Web3 from "web3";


function sign(message, privateKey) {
    const hash = cryto.createHash("sha256").update(message).digest();
    return secp256k1.ecdsaSign(hash, privateKey);
}

function recover(message, signature) {
    const hash  = cryto.createHash("sha256").update(message).digest();
    return Buffer.from(secp256k1.ecdsaRecover(signature.signature, signature.recid, hash, false));
}

//이더리움 방식
function ethSign(message, privateKey) {
    const prefix = "\x19Ethereum Signed Message:\n" + message.length;
    const buffer = Buffer.from(prefix + message);
    const hash = createKaccakHach("keccak256").update(buffer).digest();
    return secp256k1.ecdsaSign(hash, privateKey);
}

function ethRecover(message, signature) {
    const prefix = "\x19Ethereum Signed Message:\n" + message.length;
    const buffer = Buffer.from(prefix + message);
    const hash = createKaccakHach("keccak256").update(buffer).digest();
    const publicKey = Buffer.from(secp256k1.ecdsaRecover(signature.signature, signature.recid, hash, false));
    const address = key.createAddress(publicKey);
    return key.toChecksumAddress(address);
}


// const privateKey = key.createPrivateKey();
// const publicKey = key.createPublicKey(privateKey);
// console.log("publicKey:",publicKey.toString("hex"));
// const message = "Hello Blockchain";
// console.log("message:", message);

// //const { signature, recid } = sign("Hello Blockchain", privateKey);
// const signature = sign(message, privateKey);
// console.log(signature);
// const recoverKey = recover(message, signature);
// console.log("recoveredKey:",recoverKey.toString("hex"));

// //이더리움 방식
// const privateKey = key.createPrivateKey();
// const address = key.privateKeyToAddress(privateKey);
// console.log("sender address:", address);

// //web3 사용
// const web3 = new Web3();
// const account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey.toString("hex"));
// console.log(account);

// const signature = ethSign("Hello Blockchain", privateKey);
// // const recoveredAddress = ethRecover("Hello Blockchain", signature);
// // console.log("recovered address:", recoveredAddress);
// console.log(Buffer.from(signature.signature).toString("hex"));
// console.log(signature.recid);

// console.log(account.sign("Hello Blockchain"));

export default {
    sign,
    recover,
    ethSign,
    ethRecover,
};