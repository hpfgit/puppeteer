setIp();

async function setIp() {
    const axios = require('axios');
    let result = await axios.get('http://api.wandoudl.com/api/ip?app_key=3c6919e989eb724004e81231f679c379&pack=209764&num=20&xy=2&type=2&lb=\r\n&mr=1&');
    if (result.data.code === 200) {
        const ipNum = getRandom(result.data.data.length - 1, 0);
        const ip = result.data.data[ipNum]['ip'] + ':' + result.data.data[ipNum]['port'];
        register(ip);
    }
}

async function register(ip) {
    const xing = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴鬱胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍卻璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐钟离宇文长孙慕容鲜于闾丘司徒司空丌官司寇仉督子车颛孙端木巫马公西漆雕乐正壤驷公良拓跋夹谷宰父谷梁晋楚闫法汝鄢涂钦段干百里东郭南门呼延归海羊舌微生岳帅缑亢况郈有琴梁丘左丘东门西门商牟佘佴伯赏南宫墨哈谯笪年爱阳佟第五言福';
    const ming = '伟刚勇毅俊峰强军平保东文辉力明永健世广志义兴良海山仁波宁贵福生龙元全国胜学祥才发武新利清飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博诚先敬震振壮会思群豪心邦承乐绍功松善厚庆磊民友裕河哲江超浩亮政谦亨奇固之轮翰朗伯宏言若鸣朋斌梁栋维启克伦翔旭鹏泽晨辰士以建家致树炎德行时泰盛秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊兰凤洁梅琳素云莲真环雪荣爱妹霞香月莺媛艳瑞凡佳嘉琼勤珍贞莉桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑筠柔竹霭凝晓欢霄枫芸菲寒欣滢伊亚宜可姬舒影荔枝思丽秀飘育馥琦晶妍茜秋珊莎锦黛青倩婷宁蓓纨苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希';
    const x = getXing(xing);
    const m = getMing(ming);
    const passwordStr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
    const passwordStr2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const passwordStr3 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const puppeteer = require('puppeteer');
    const { TimeoutError } = require('puppeteer/Errors');
    const { getPhoneNumber, getCode, authCode } = require('./getCode');
    let password1 = pass(passwordStr, getRandom(5, 3));
    let password2 = pass(passwordStr2, getRandom(4, 2));
    let password3 = pass(passwordStr3, getRandom(6, 4));
    let password = password1 + password2 + password3;
    let phone = await getPhoneNumber();
    let browser = null;
    let page = null;
    try {
        browser = await puppeteer.launch({
            devtools: false,
            headless: false,
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--ignore-certificate-errors',
                `--proxy-server=${ip}`
            ]
        });
        page = await browser.newPage();
        await page.goto("https://www.nike.com/cn/", {
            waitUntil: [
                "load"
            ]
        });
        await page.waitFor('.nav-btn.p0-sm.prl3-sm.pt2-sm.pb2-sm.fs12-nav-sm.d-sm-b.nav-color-grey.hover-color-black');
        await page.waitFor(1000);
        const navbar = await page.$('.nav-btn.p0-sm.prl3-sm.pt2-sm.pb2-sm.fs12-nav-sm.d-sm-b.nav-color-grey.hover-color-black');
        await navbar.click();
        await page.waitFor('.nike-unite-component.action-link.mobileLoginJoinLink.current-member-signin a');
        const join = await page.$('.nike-unite-component.action-link.mobileLoginJoinLink.current-member-signin a');
        await join.click();
        await page.waitFor('.phoneNumber');
        await page.type('.phoneNumber', phone, { delay: 100 });
        await page.waitFor('.sendCodeButton');
        const sendCodeButton = await page.$('.sendCodeButton');
        await page.waitFor('.sendCode .error');
        const content = await page.$eval('.sendCode .error', el => el.innerHTML);
        await sendCodeButton.click();
        await page.waitFor(100);
        getCode(browser, phone, page, x, m, y = getYear(), mo = "04", d = getDay(), password);
    } catch (error) {
        // 如果超时，做一些处理。
        console.log(error);
        await page.waitFor(1000);
        await page.close();
        await browser.close();
        setIp();
    }
}

function getRandom(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getXing(str) {
    const arr = str.split('');
    const random = getRandom(str.length - 1, 0);
    return arr[random];
}

function getMing(str) {
    const arr = str.split('');
    const start = getRandom(str.length - 1, 0);
    const end = getRandom(str.length - 1, 0);
    return arr[start] + arr[end];
}

function getYear() {
    return getRandom(2000, 1990);
}

function getmou() {
    let m = getRandom(12, 1);
    if (m < 10) {
        m = '0' + m;
    }
    return m;
}

function getDay() {
    let m = getRandom(28, 1);
    if (m < 10) {
        m = '0' + m;
    }
    return m;
}

function pass(passwordStr, length) {
    let Str = "";
    for (let i = 0; i < length; i++) {
        Str += passwordStr[Math.floor(Math.random() * passwordStr.length)];
    }
    return Str;
}

module.exports = {
    setIp
}


