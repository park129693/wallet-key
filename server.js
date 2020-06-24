import express from "express";
import bodyParser from "body-parser";
import secp256k1 from "secp256k1";
import key from "./key.js";
import ecdsa from "./ecdsa.js";

const port = 3000;
const host = "127.0.0.1";

const app = express();
app.use(bodyParser.json());

let privateKey;

app.post("/", (_, res)=>{
    res.send("success");
});

app.post("/create_key", (_, res) => {
    const mnemonic = key.createMnemonic();
    privateKey = key.mnemonicToPrivatekey(mnemonic);
    const address = key.privateKeyToAddress(privateKey);
    res.json({
        mnemonic: mnemonic.toString(),
        privateKey: privateKey.toString("hex"),
        address: address,
    });
});

app.post("/import_key", (req, res) => {
    try {
        if(!("privateKey" in req.body)) {
            throw new Error("'privateKey' is required");
        }
        const temp = Buffer.from(req.body.privateKey, "hex");
        if (secp256k1.privateKeyVerify(temp) === false) {
            throw new Error("invalid private key");
        }
        privateKey = temp;
        const address = key.privateKeyToAddress(privateKey);
        response.json({
            importedAddress: address,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
        })
    }
});

app.post("/current_address", (_, res) => {
    try {
        if (!privateKey) { //privateKey가 비어 있으면
            throw new Error("privateKey is not set");
        }
        const address = key.privateKeyToAddress(privateKey);
        res.json({
            createAddress: address,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message,
        })
    }
});

app.post("/sign",(req, res) =>{
    try {
        if (!privateKey) { //privateKey가 비어 있으면
            throw new Error("privateKey is not set");
        }
        if(!("message" in req.body)) {
            throw new Error("'message' is required");
            }
            const signature = ecdsa.sign(req.body.message, privateKey);
            res.json({
                signature: Buffer.from(signature.signature).toString("hex"),
                recid: signature.recid,
            });
        } catch (error) {
            res.status(500).json({
                error: error.message,
            });
        }
});

app.listen(port, host);
