
const allStrs = `0123456789abcdefghijklmnopqrstuvwxyz`;
const eStrs = `abcdefghijklmnopqrstuvwxyz`;

function randomNum(minNum, maxNum) {
    let Range = maxNum - minNum;
    let Rand = Math.random();
    let num = minNum + Math.round(Rand * Range); //四舍五入
    return num;
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