const puppeteer = require("puppeteer");
const http = require("http");
const axios = require("axios");

multilogin();

function multilogin() {
    axios
        .post(
            "https://api.multiloginapp.com/v2/profile?token=ac167f49c671594a13db35eee41eba9ff0fd41bf&mlaVersion=4.5.3&defaultMode=FAKE",
            {
                name: "testProfile",
                notes: "Test profile notes",
                browser: "mimic",
                os: "win"
            }
        )
        .then(result => {
            console.log(result.data.uuid);
            const profileId = result.data.uuid;
            startProfile(profileId);
        })
        .catch(error => {
            console.log(error);
        });
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
        multilogin();
        console.log(err.message);
    });
}

module.exports = {
    multilogin
}
