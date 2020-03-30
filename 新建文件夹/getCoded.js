let username = "diaon3307"
let password = "diaon123yes"
let token = "a0473ef2422f96ba31f98cd0a5ee7b47"
let itemID = "29629"

const axios = require('axios');
const db = require('./Connect');
let timer = null;
let time = 0;
let maxTime = 1000 * 60;

function getToken() {
    return new Promise((resolve, reject) => {
        axios.get("http://49.234.69.192:8000/api/sign/username=" + username + "&password=" + password).then(result => {
            resolve(result);
        }).catch(error => {
            reject(error);
        })
    })
}

function getPhoneNumber() {
    return new Promise((resolve, reject) => {
        axios.get("http://49.234.69.192:8000/api/yh_qh/id=" + itemID + "&operator=0&Region=0&card=0&phone=&loop=1&token=" + token).then(result => {
            const data = result.data;
            const hm = data.split('=');
            const phone = hm[hm.length - 1];
            for (let item of ["165", "162", "167"]) {
                // console.log(item);
                if (phone.indexOf(item) !== -1) {
                    getPhoneNumber();
                    break;
                }
            }
            // getCode();
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}

async function getCode(phoneNumber, page, x, m, y, mo, d, p) {
    clearTimeout(timer);
    console.log(phoneNumber, page, x, m, y, mo, d, p);
    return new Promise((resolve, reject) => {
        axios.get("http://49.234.69.192:8000/api/yh_qm/id=29629&phone=" + phoneNumber + "&t=diaon3307&token=" + token).then(async result => {
            let authCode = result.data.toString();
            if (authCode.indexOf('NIKE') !== -1) {
                await page.type('input.code', authCode.substr(authCode.length - 6, authCode.length), { delay: 100 });
                await page.waitFor(500);
                const singIn = await page.$('.nike-unite-submit-button.mobileJoinContinue.nike-unite-component input');
                singIn.click();
                await page.waitFor(1000);
                await page.type('input[name="lastName"]', x, { delay: 100 });
                await page.waitFor(500);
                await page.type('input[name="firstName"]', m, { delay: 100 });
                await page.waitFor(500);
                await page.type('input[name="dateOfBirth"]', (y + mo + d), { delay: 100 });
                await page.waitFor(500);
                await page.type('input[name="password"]', p, { delay: 100 });
                await page.waitFor(500);
                const componentname = await page.$('ul[data-componentname="gender"] li');
                await componentname.click();
                await page.waitFor(500);
                const nike = await page.$('.nike-unite-submit-button.mobileJoinSubmit.nike-unite-component');
                await nike.click();
                await page.waitFor(500);
                db.insert({
                    tel: phoneNumber,
                    password: p
                }, 'nike').then(() => {
                    console.log('ok');
                }).catch();
                resolve(authCode.substr(authCode.length - 6, authCode.length));
                clearTimeout(timer);
                console.log("获取验证码成功!验证码为:" + authCode.substr(authCode.length - 6, authCode.length));
            } else {
                if (time >= maxTime) {
                    time = 0;
                    axios.get("http://49.234.69.192:8000/api/yh_sf/id=" + itemID + "&phone=" + phoneNumber + "&token=" + token).then(result => {
                        console.log(result);
                    }).catch(error => {
                        console.log(error);
                    });
                    reject({ status: 505 });
                }
                time += 5000;
                timer = setTimeout(() => {
                    getCode(phoneNumber, page, x, m, y, mo, d, p);
                }, 5000);
            }
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
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