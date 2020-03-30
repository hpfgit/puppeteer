const puppeteer = require("puppeteer");
const http = require("http");
const axios = require("axios");

multilogin();

async function multilogin() {
    let result = await axios.get('http://api.wandoudl.com/api/ip?app_key=3c6919e989eb724004e81231f679c379&pack=209764&num=1&xy=3&type=2&lb=\r\n&mr=1&');
    if (result.data.code === 200) {
        const ipNum = 0;
        const ip = result.data.data[ipNum]['ip'];
        const port = result.data.data[ipNum]['port'];
        axios
            .post(
                "https://api.multiloginapp.com/v2/profile?token=ac167f49c671594a13db35eee41eba9ff0fd41bf&mlaVersion=4.5.3&defaultMode=FAKE",
                {
                    name: "testProfile",
                    notes: "Test profile notes",
                    browser: "mimic",
                    os: "win",
                    // "proxyHost": "114.238.54.34",
                    // "proxyPort": 6030,
                    // "proxyIpValidation": false,
                    // "proxyType": "socks5",
                    "network": {
                        "proxy": {
                            "type": "SOCKS",
                            "host": ip,
                            "port": port,
                            // "username": "844159670@qq.com",
                            // "password": "gm123yes"
                        }
                    }
                }
            )
            .then(result => {
                console.log(result.data.uuid);
                const profileId = result.data.uuid;
                startProfile(profileId);
            })
            .catch(error => {
                multilogin();
                console.log(error);
            });
    }
}
const { setIp } = require("./register");
function startProfile(profileId) {
    // let profileId = "297a5145-f679-489e-9513-9490f03ed5b8";
    let mlaPort = 35000;

    /*Send GET request to start the browser profile by profileId.
  Returns web socket as response which should be passed to puppeteer.connect*/
    http.get(
        `http://127.0.0.1:${mlaPort}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${profileId}`,
        resp => {
            let data = "";
            let ws = "";

            //Receive response data by chunks
            resp.on("data", chunk => {
                data += chunk;
            });

            /*The whole response data has been received. Handling JSON Parse errors,
                verifying if ws is an object and contains the 'value' parameter.*/
            resp.on("end", () => {
                let ws;
                try {
                    ws = JSON.parse(data);
                } catch (err) {
                    console.log(err);
                }
                if (typeof ws === "object" && ws.hasOwnProperty("value")) {
                    console.log(`Browser websocket endpoint: ${ws.value}`);
                    setIp(ws.value);
                }
            });
        }
    ).on("error", err => {
        console.log(err.message);
    });
}

module.exports = {
    multilogin
}
