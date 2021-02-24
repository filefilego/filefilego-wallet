import fs from "fs";
var sha256 = require("js-sha256");

var crypto = require("crypto");
const { Keccak } = require("sha3");
const libp2pcrypto = require("libp2p-crypto");
const secp256k1 = libp2pcrypto.keys.supportedKeys.secp256k1;

let nameKDF = "scrypt",
  scryptKeyLen = 32,
  scryptN = 1 << 18,
  scryptR = 8,
  scryptP = 1,
  ksVersion = 3,
  ksCipher = "aes-128-ctr";

const DecodeHex = (hexStr) => {
  return Uint8Array.from(Buffer.from(hexStr, "hex"));
};

const EncodeBytesToHex = (bts) => {
  return Buffer.from(bts).toString("hex");
};

const NewKeypair = async () => {
  return await secp256k1.generateKeyPair();
};

const SignTransaction = async (tx, key) => {
  let publicDt = key.public.bytes.slice(4);
  let publicKeyString = "0x" + EncodeBytesToHex(publicDt);

  let txData = Buffer.from("");
  if (tx.Data != "") {
    txData = DecodeHex(tx.Data);
    tx.Data = "0x" + tx.Data;
  }

  let pubKey = Buffer.from(publicKeyString),
    nounce = Buffer.from(tx.Nounce),
    from = Buffer.from(tx.From),
    to = Buffer.from(tx.To),
    value = Buffer.from(tx.Value),
    transactionFees = Buffer.from(tx.TransactionFees);

  tx.PubKey = publicKeyString;
  let data = Buffer.concat([
    pubKey,
    nounce,
    txData,
    from,
    to,
    value,
    transactionFees,
    DecodeHex("01"),
  ]);

  var hasher = sha256.create();
  hasher.update(data);
  let hashTx = hasher.hex();

  // Hash and Signature of a tx are buffers and not strings

  tx.Hash = "0x" + hashTx;
  let signedDt = await key.sign(DecodeHex(hashTx));
  tx.Signature = "0x" + EncodeBytesToHex(Buffer.from(signedDt));

  return tx;
};

const PrepareKeyFilename = (address) => {
  let dt = new Date();
  let str = `UTC--${dt.toISOString()}--${address}.json`;
  return str.replace(/:/g, "-");
};

const NewKeyAndStoreToPathAndReturnJSON = async (pass, pathToSave) => {
  let key = await NewKeypair();
  let jsonKey = await MarshalKey(key, pass);
  let fname = PrepareKeyFilename("0x" + jsonKey.address);
  console.log(fname);
  fs.writeFileSync(pathToSave + fname, JSON.stringify(jsonKey, null, 2));
  return { key: jsonKey, file_name: fname };
};

const MarshalKey = async (key, passphrase) => {
  let salt = libp2pcrypto.randomBytes(32);
  let dk = crypto.scryptSync(passphrase, salt, scryptKeyLen, {
    r: scryptR,
    p: scryptP,
    N: scryptN,
    maxmem: 1024000000,
  });

  let iv = libp2pcrypto.randomBytes(16);
  let enckey = dk.slice(0, 16);
  let privateKeyBytes = key.bytes;
  privateKeyBytes = privateKeyBytes.slice(4);

  const cipher = await libp2pcrypto.aes.create(enckey, iv);
  const encryptedBuffer = await cipher.encrypt(Buffer.from(privateKeyBytes));

  let dt = dk.slice(16, 32);
  let hash = new Keccak(256);
  let mac = hash.update(Buffer.concat([dt, encryptedBuffer]));
  mac = hash.digest("hex");

  let publicDt = key.public.bytes.slice(4);
  let hashPub = new Keccak(256);
  hashPub.update(publicDt);
  let address = hashPub.digest("hex");
  address = address.slice(24);

  let keyStruct = {
    address: address,
    crypto: {
      cipher: ksCipher,
      ciphertext: EncodeBytesToHex(encryptedBuffer),
      cipherparams: {
        iv: EncodeBytesToHex(iv),
      },
      kdf: nameKDF,
      kdfparams: {
        n: scryptN,
        r: scryptR,
        p: scryptP,
        dklen: scryptKeyLen,
        salt: EncodeBytesToHex(salt),
      },
      mac: mac,
    },
    id: await key.id(),
    version: 3,
  };

  return keyStruct;
};

const UnmarshalKey = async (data, passphrase) => {
  try {
    let encjson = JSON.parse(data);

    if (encjson.version != ksVersion) {
      return { error: "Version Mismatch" };
    }
    if (encjson.crypto.cipher != ksCipher) {
      return { error: "Cipher Mismatch" };
    }

    let iv = DecodeHex(encjson.crypto.cipherparams.iv),
      salt = DecodeHex(encjson.crypto.kdfparams.salt),
      ciphertext = DecodeHex(encjson.crypto.ciphertext);

    let dk = crypto.scryptSync(passphrase, salt, scryptKeyLen, {
      r: scryptR,
      p: scryptP,
      N: scryptN,
      maxmem: 1024000000,
    });

    let dt = dk.slice(16, 32);

    let newdt = Buffer.from(ciphertext);

    let hash = new Keccak(256);
    hash.update(Buffer.concat([dt, newdt]));
    let hashOfDkCypher = hash.digest("hex");

    if (hashOfDkCypher != encjson.crypto.mac) {
      return { error: "Mac Mismatch" };
    }

    let cypherBts = dk.slice(0, 16);
    let ivBlock = Buffer.from(iv);
    const cipher = await libp2pcrypto.aes.create(cypherBts, ivBlock);
    const decryptedBuffer = await cipher.decrypt(newdt);
    let privatekey = await secp256k1.unmarshalSecp256k1PrivateKey(
      decryptedBuffer
    );

    return { error: false, key: privatekey };
  } catch (e) {
    return { error: e };
  }
};

export default {
  UnmarshalKey,
  MarshalKey,
  NewKeyAndStoreToPathAndReturnJSON,
  SignTransaction,
  DecodeHex,
  EncodeBytesToHex,
};
