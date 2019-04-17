exports.generateStrs = function (strLength) {
    let allStrs = `0123456789abcdefghijklmnopqrstuvwxyz`;
    strLength = strLength ? strLength : 10;
    let retStrs = '';
    for (let i = 0; i < strLength; i++) {
        ret += randomNum[0, 35];
    }

    return retStrs;
}

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
}