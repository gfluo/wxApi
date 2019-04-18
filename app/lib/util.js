
function randomNum(minNum, maxNum) {
    let Range = maxNum - minNum;
    let Rand = Math.random();
    let num = minNum + Math.round(Rand * Range); //四舍五入
    return num;
}

function generateStrs(strLength) {
    let allStrs = `0123456789abcdefghijklmnopqrstuvwxyz`;
    strLength = strLength ? strLength : 10;
    let retStrs = '';
    for (let i = 0; i < strLength; i++) {
        let charIndex = randomNum(0, 35);
        retStrs += allStrs[charIndex];
    }

    return retStrs;
}


exports.generateStrs = generateStrs;