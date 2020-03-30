const puppeteer = require('puppeteer-cn');
const axios = require('axios');
const db = require('./Connect');
let timer = null;
let interval = 2000;
let ids = [];
let num = 0;

const codeArr = [
    "3MBA48182312226",
    "3MBA02439482485",
    "3MBA18859488656",
    "3MBA16153766649",
    "3MBA16816365364",
    "3MBA16173615314",
    "3MBA21739939365",
    "3MBA33199845779",
    "3MBA40523647912",
    "3MBA07712576761",
    "3MBA43732345779",
    "3MBA28464348195",
    "3MBA21625274734",
    "3MBA51122814268",
    "3MBA34428392441",
    "3MBA54356658878",
    "3MBA11635533778",
    "3MBA19712745415",
    "3MBA26484714944"];

(async (url = 'https://www.nike.com/cn/t/sportswear-essentials-女子短袖上衣-szrh02/CT2588-100', productName = 'CT2588-100') => {
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
            `--proxy-server=114.101.247.119:36410`
        ]
    });
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "networkidle2"
    });
    getData();
    clearInterval(timer);
    timer = setInterval(getData, interval);
    async function getData() {
        
        db.query('SELECT id FROM nike').then(async arr => {
            // window.location.reload();
            page.reload()
            ids = arr;
            const data = await page.evaluate('INITIAL_REDUX_STATE');
            const productID = data['Threads']['products'][productName]['id'];
            const availableSkusData = data['Threads']['products'][productName]['availableSkus'];
            const availableSkus = [];
            for (let sku of availableSkusData) {
                availableSkus.push(sku['id'])
            }
            // console.log(availableSkus);
            for (let sku of data['Threads']['products'][productName]['skus']) {
                // console.log(sku['skuId']);
                if (sku['nikeSize'] !== 'XS') {
                    if (availableSkus.includes(sku['skuId'])) {
                        console.log(new Date() + "查询到可以购买的商品:SKUID:" + sku['skuId'])
                        const skuId = sku['skuId'];
                        const id = ids[num]['id'];
                        console.log(id);
                        if (num >= ids.length) {
                            return;
                        }
                        num += 1;
                        avaliable = 'buy';
                        url = `http://127.0.0.1:8080/api/webBuy?id=${id}&product_id=${productID}&sku_id=${skuId}&promotion_codes=${codeArr[num]}`
                        console.log(url)
                        axios.get(url, {});
                        // console.log(num ,id);
                    } else {
                        avaliable = ''
                        console.log(new Date() + "未查询到可以购买的商品")
                    }
                }
            }
        });
    }
})();

/**
 * id
 * skuid
 * 
 */