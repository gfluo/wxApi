const crypto = require('crypto');
const allStrs = `0123456789abcdefghijklmnopqrstuvwxyz`;
const eStrs = `abcdefghijklmnopqrstuvwxyz`;

function randomNum(minNum, maxNum) {
    let Range = maxNum - minNum;
    let Rand = Math.random();
    let num = minNum + Math.round(Rand * Range); //四舍五入
    return num;
}

function AESsecret(data, key, iv) {
    iv = iv || "";
    let clearEncoding = 'utf8';
    let cipherEncoding = 'base64';
    let cipherChunks = [];
    let cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}

function generateStrs(strLength, type) {
    let strs = type ? eStrs : allStrs;
    strLength = strLength ? strLength : 10;
    let retStrs = '';
    for (let i = 0; i < strLength; i++) {
        let charIndex = randomNum(0, (strs.length - 1));
        retStrs += strs[charIndex];
    }

    return retStrs;
}


exports.generateStrs = generateStrs;
exports.AESsecret = AESsecret;