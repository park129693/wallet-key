//const cryto = require("crypto");
import cryto from "crypto";
import secp256k1 from "secp256k1";
import createKeccakHash from "keccak";
//import keccak from "keccak";

function createPrivatekey() {
    let privateKey;
    do{
        privateKey = cryto.randomBytes(32);
    } while (secp256k1.privateKeyVerify(privateKey) === false);
    return privateKey;
}

//console.log(createPrivatekey().toString("hex"));

function createPublickey(privateKey, compressed = false) {
    return Buffer.from(secp256k1.publicKeyCreate(privateKey, compressed));
}

function createAddress(publicKey) {
    const hash = createKeccakHash("keccak256").update(publicKey.slice(1)).digest("hex");
    return "0x" + hash.slice(24);
}
// let 변수는 변경 가능
// const 변수는 변경 불가 값

// const privateKey = Buffer.from("E97FBC95588CCE7606F14B16F652FEFE7F35320A4311439499921228F8A3F783", "hex");
// const publicKey = createPublickey(privateKey);
// const address = createAddress(publicKey);
// console.log(address);

const privateKey = Buffer.from("000000000000000000000000000000000000000000000000000000000000270A", "hex");
const publicKey = createPublickey(privateKey);
const address = createAddress(publicKey);
const ChecksumAddress = toChecksumAddress(address);

console.log(address);
console.log(ChecksumAddress);


// let privateKey = createPrivatekey();
// console.log("Private Key:",privateKey.toString("hex"));
// console.log("Address:",createAddress(createPublickey(privateKey)));

// 이더리움 주소 대소문자 변화 규칙 내용
function toChecksumAddress (address) {
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  var ret = '0x'

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}