const username = "diaon3307";
const password = "diaon123yes";
let token = "09F1FB6B7C3A5BE4C763A0BDA42DE00E";
const itemID = "3119";

const axios = require('axios');
const db = require('./Connect');
let timer = null;
let timer2 = null;
let time = 0;
let maxTime = 1000 * 60;

function getToken() {
    return new Promise((resolve, reject) => {
        axios.get("http://www.mili18.com:9180/service.asmx/UserLoginStr?name=" + username + "&psw=" + password).then(result => {
            token = result.data;
            console.log(token);
            resolve(result.data);
        }).catch(error => {
            reject(error);
        })
    })
}

function getPhoneNumber() {
    return new Promise((resolve, reject) => {
        axios.get("http://www.mili18.com:9180/service.asmx/GetHM2Str?token=" + token + "&xmid=" + itemID + "&sl=1&lx=170&a1=&a2=&pk=&ks=0&rj=").then(result => {
            console.log(result);
            // if (/(-1|-2|-3|-4|-8|-11|-12|-15)/.test(result.data) || result.data === '') {
            //     getToken().then(() => {
            //         const { setIp } = require('./register');
            //         setIp();
            //     });
            // }
            const data = result.data;
            const hm = data.split('=');
            const phone = hm[hm.length - 1];
            for (let item of ["165", "162", "167"]) {
                if (phone.indexOf(item) !== -1) {
                    axios.get("http://49.234.69.192:8000/api/yh_sf/id=" + itemID + "&phone=" + item + "&token=" + token).then(result => {
                        console.log(result);
                    }).catch(error => {
                        console.log(error);
                    });
                    getPhoneNumber();
                    break;
                }
            }
            // getCode();
            resolve(phone);
        }).catch((error) => {
            reject(error);
        });
    });
}

async function getCode(browser, phoneNumber, page, x, m, y, mo, d, p) {
    clearTimeout(timer);
    axios.get("http://www.mili18.com:9180/service.asmx/GetYzm2Str?token=" + token + "&xmid=" + itemID + "&hm=" + phoneNumber + "&sf=1").then(async result => {
        let authCode = result.data.toString();
        if (authCode.indexOf('NIKE') !== -1) {
            await page.type('input.code', authCode.substr(authCode.length - 6, authCode.length), { delay: 100 });
            await page.waitFor('.nike-unite-submit-button.mobileJoinContinue.nike-unite-component input');
            const singIn = await page.$('.nike-unite-submit-button.mobileJoinContinue.nike-unite-component input');
            await singIn.click();
            await page.waitFor('input[name="lastName"]');
            await page.type('input[name="lastName"]', x, { delay: 100 });
            await page.waitFor('input[name="firstName"]');
            await page.type('input[name="firstName"]', m, { delay: 100 });
            await page.waitFor('input[name="dateOfBirth"]');
            const dateOfBirth = await page.$('input[name="dateOfBirth"]');
            await dateOfBirth.click();
            await page.type('input[name="dateOfBirth"]', y.toString(), { delay: 100 });
            await page.keyboard.down('Tab');
            await page.waitFor(500);
            await page.type('input[name="dateOfBirth"]', mo.toString(), { delay: 100 });
            await page.waitFor(500);
            await page.type('input[name="dateOfBirth"]', d.toString(), { delay: 100 });
            await page.waitFor('input[name="password"]');
            await page.type('input[name="password"]', p, { delay: 100 });
            await page.waitFor('ul[data-componentname="gender"] li');
            const componentname = await page.$('ul[data-componentname="gender"] li');
            await componentname.click();
            await page.waitFor('.nike-unite-submit-button.mobileJoinSubmit.nike-unite-component');
            const nike = await page.$('.nike-unite-submit-button.mobileJoinSubmit.nike-unite-component');
            await nike.click();
            await page.waitFor('.nike-unite-action-button.mobileJoinEmailSkipButton.nike-unite-component');
            const email = await page.$('.nike-unite-action-button.mobileJoinEmailSkipButton.nike-unite-component');
            await email.click();
            db.insert({
                tel: phoneNumber,
                password: p
            }, 'nike').then(() => {
                console.log('ok');
            }).catch();
            await page.waitFor(1000);
            await page.close();
            await browser.close();
            clearTimeout(timer);
            console.log("获取验证码成功!验证码为:" + authCode.substr(authCode.length - 6, authCode.length));
            const { setIp } = require('./register');
            setIp();
        } else {
            if (time >= maxTime) {
                time = 0;
                clearTimeout(timer);
                await page.waitFor(1000);
                await page.close();
                await browser.close();
                const { setIp } = require('./register');
                setIp();
            }
            time += 5000;
            timer = setTimeout(() => {
                getCode(browser, phoneNumber, page, x, m, y, mo, d, p);
            }, 5000);
        }
    }).catch(async (error) => {
        console.log(error);
        time += 5000;
        timer = setTimeout(() => {
            getCode(browser, phoneNumber, page, x, m, y, mo, d, p);
        }, 5000);
    });
}

async function fn() {
    // const p1 = getPhoneNumber();
    // const p2 = getCode();
    // Promise.all([p1, p2]).then(result => {
    //     console.log(result);
    // });
    // let token = await getToken();
    // console.log(token);
}

fn();

module.exports = {
    getPhoneNumber,
    getCode
}