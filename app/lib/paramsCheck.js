class check {
    static async register(params) {
        let err = '';

        let cnStr = /.*[\u4e00-\u9fa5]+.*$/;
        let cnCheck = cnStr.test(params.username);
        if (cnCheck) {
            err = '用户名含有汉字';
            return err;
        }

        if (params.username.length < 6) {
            err = '用户名长度小于6';
            return err;
        }

        let num = /[0-9]/;
        let numCheck = num.test(params.password);
        if (!numCheck) {
            err = '密码不包含数字';
            return err;
        }
        let str = /[a-z]/i;
        let strCheck = str.test(params.password);
        if (!strCheck) {
            err = "密码不包含字母";
            return err;
        }
        let _check = params.password.indexOf('_');
        if (-1 === _check) {
            err = "密码不包含下横线"
            return err;
        };

        if (params.password.length < 6) {
            err = '密码长度小于6';
            return err;
        }

        return err;
    }
}

module.exports = check;