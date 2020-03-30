const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        devtools: false,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const page = await browser.newPage();
    await page.goto("https://www.nike.com/cn/");
    await page.waitFor(1000);
    const navbar = await page.$('.nav-btn.p0-sm.prl3-sm.pt2-sm.pb2-sm.fs12-nav-sm.d-sm-b.nav-color-grey.hover-color-black');
    await navbar.click();
    await page.waitFor(1000);
    // const login = await page.$('.ncss-brand.text-color-grey.pt6-sm.pb6-sm.d-sm-b.u-uppercase.fs19-sm.fs22-md.fs16-lg.bg-transparent');
    // await login.click();
    // await page.waitFor(1000);
    // const emailLogin = await page.$('.nike-unite-component.action-link.mobileNumberToEmailLoginLink.toggle-action-link>a');
    // await emailLogin.click();
    // await page.waitFor(3000);
    const username = "17164525730";
    const password = "UX7gCHcf3b";
    await page.type('input[name="verifyMobileNumber"]', username, {delay: 0});
    await page.type('input[name="password"]', password, {delay: 0});
    await page.keyboard.press('Enter');
    await page.waitFor(5000);
    // await page.waitFor(5000);
    await page.goto('https://unite.nike.com/session.html');
    const cok = await page.evaluate(function() {
        const store = localStorage.getItem('com.nike.commerce.nikedotcom.web.credential');
        const res = JSON.parse(store);
        return ([res['user_id'],res['access_token'],res['refresh_token']]);
    });
    console.log(cok);
    await page.close();
    // await page.waitFor(3000);
    // const sizes = await page.$$('.size-grid-dropdown.size-grid-button');
    // await sizes[2].click();
    // await page.waitFor(1000);
    // const joinButton = await page.$('button[data-qa="add-to-cart"]');
    // await joinButton.click();
    // await page.waitFor(2000);
    // const ShopCart = await page.$('.ncss-btn-black.ncss-brand.fs16-sm.pt3-sm.pr5-sm.pb3-sm.pl5-sm.mt4-sm.mr4-sm.u-uppercase.cart-link');
    // await ShopCart.click();
    // await page.waitFor(3000);
    // const lname = '郝';
    // const fname = '鹏飞';
    // await page.select('.js-state', 'CN-12');
    // await page.waitFor(1000);
    // await page.select('.js-city', '天津市');
    // await page.waitFor(1000);
    // await page.select('.js-county', '西青区');
    // await page.waitFor(1000);
    // const address = '西青区';
    // const tel = "15733036829";
    // await page.type('input[name="lname"]', lname, {delay: 0});
    // await page.type('input[name="fname"]', fname, {delay: 0});
    // await page.type('input[name="address1Field"]', address, {delay: 0});
    // await page.type('input[name="phoneNumber"]', tel, {delay: 0});
    // const SButton = await page.$('input[name="shipSubmit"]');
    // await SButton.click();
    // await page.waitFor(1000);
    // const buyButton = await page.$('.ch4_btn.ch4_btnOrange.ch4_btnDropShadow.ch4_btnPlaceOrder');
    // await buyButton.click();
    // await page.waitFor(1000);
    // // const sett = await page.$('#ch4_cartCheckoutBtn');
    // // await sett.click();
    // // await page.waitFor(3000);
    // await page.screenshot({path: 'nike.png'});
    console.log('完成');
})();
