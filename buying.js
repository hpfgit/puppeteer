const puppeteer = require('puppeteer-cn');
const axios = require('axios');
const db = require('./Connect');
let timer = null;
let interval = 100;
let ids = [];
let num = 0;
let ipNum = 0;
let ipTime = 0;
let ipMaxTime = 1000 * 60 * 10;
// let url = 'https://www.nike.com/cn/t/sportswear-essentials-女子短袖上衣-szrh02/CT2588-100';
let url = 'https://www.nike.com/cn/t/air-max-verona-%E5%A5%B3%E5%AD%90%E8%BF%90%E5%8A%A8%E9%9E%8B-009n90/CI9842-500';
let productName = 'CI9842-500';
let panic_arr = [];
let avaliable = '';

setIp(url, productName);

function setIp(url, productName) {
    axios.get('http://api.wandoudl.com/api/ip?app_key=3c6919e989eb724004e81231f679c379&pack=209764&num=20&xy=2&type=2&lb=\r\n&mr=1&').then(async result => {
        if (result.data.code === 200) {
            const ip = result.data.data[ipNum]['ip'] + ':' + result.data.data[ipNum]['port'];
            const browser = await puppeteer.launch({
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
            process.on('unhandledRejection', async (reason, p) => {
                console.log('Unhandled Rejection at:', p, 'reason:', reason);
                await browser.close();
                await page.waitFor(1000);
                setIp(url, productName);
                return;
                // application specific logging, throwing an error, or other logic here
            });
            const page = await browser.newPage();
            await page.goto(url, {
                waitUntil: "networkidle2"
            });
            getData(page, browser);
            async function getData(page, browser) {
                panic_arr = [];
                db.query('SELECT id FROM nike').then(async arr => {
                    db.query('SELECT promotion_code FROM nike_code WHERE used != 1').then(async result => {
                        const data = await page.evaluate('INITIAL_REDUX_STATE');
                        const productID = data['Threads']['products'][productName]['id'];
                        const availableSkusData = data['Threads']['products'][productName]['availableSkus'];
                        const availableSkus = [];
                        for (let sku of availableSkusData) {
                            availableSkus.push(sku['id'])
                        }
                        for (let sku of data['Threads']['products'][productName]['skus']) {
                            if (sku['nikeSize'] !== 'XS') {
                                if (availableSkus.includes(sku['skuId'])) {
                                    sku['promotion_code'] = result[0]['promotion_code'];
                                    sku['id'] = arr[num]['id'];
                                    sku['productID'] = productID;
                                    panic_arr.push(sku);
                                    console.log(new Date() + "查询到可以购买的商品:SKUID:" + sku['skuId'])
                                    // const skuId = sku['skuId'];
                                    // const id = arr[num]['id'];
                                    // const promotion_code = result[0]['promotion_code'];
                                    // if (ipTime >= ipMaxTime) {
                                    //     clearInterval(timer);
                                    //     await browser.close();
                                    //     setIp(url, productName);
                                    //     return;
                                    // }
                                    // if (num >= arr.length) {
                                    //     return;
                                    // }
                                    // num += 1;
                                    avaliable = 'buy';
                                    // let url = `http://127.0.0.1:8080/api/webBuy?id=${id}&product_id=${productID}&sku_id=${skuId}&promotion_codes=${promotion_code}`
                                    // console.log(url);
                                    // axios.get(url, {}).then(() => {
                                    // db.update({
                                    // used: 2
                                    // }, 'nike_code', {promotion_code: '11111'}).then().catch();
                                    // }).catch();
                                    // console.log(num ,id);
                                } else {
                                    avaliable = ''
                                    console.log(new Date() + "未查询到可以购买的商品")
                                }
                            }
                        }
                        console.log(panic_arr);
                        // panic_arr.map(item => {
                        clearTimeout(timer);
                        timer = setInterval(async () => {
                            if (num >= panic_arr.length - 1) {
                                console.log('完成');
                                clearInterval(timer);
                                await page.reload({
                                    timeout: 1000,
                                    waitUntil: [
                                        "load"
                                    ]
                                });
                                getData(page, browser);
                                // browser.close();
                            }
                            const skuId = panic_arr[num]['skuId'];
                            const id = panic_arr[num]['id'];
                            const promotion_code = panic_arr[num]['promotion_code'];
                            const productID = panic_arr[num]['productID'];
                            let url = `http://127.0.0.1:8080/api/webBuy?id=${id}&product_id=${productID}&sku_id=${skuId}&promotion_codes=${promotion_code}`
                            console.log(url);
                            num += 1;
                            // axios.get(url, {}).then(() => {
                            //     db.update({
                            //         used: 2
                            //     }, 'nike_code', {promotion_code: '11111'}).then().catch();
                            // }).catch();
                        }, interval);
                        // });
                    });
                });
            }
        }
    }).catch(error => {
        console.log(error);
    });
}
