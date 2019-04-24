class check {
    static async register(params) {
        let err = '';

        let specialStr = new RegExp("[~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        let specialCheck = specialStr.test(params.username) || specialStr.test(params.password);
        if (specialCheck) {
            err = '用户名或者密码包含特殊字符';
            return err;
        }

        let cnStr = /.*[\u4e00-\u9fa5]+.*$/;
        let cnCheck = cnStr.test(params.username) || cnStr.test(params.password);
        if (cnCheck) {
            err = '用户名或者密码含有汉字';
            return err;
        }

        if (params.username.length < 6) {
            err = '用户名长度小于6';
            return err;
        }

        if (params.password.length < 6) {
            err = '密码长度小于6';
            return err;
        }

        return err;
    }
}

module.exports = check;