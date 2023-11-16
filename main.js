const axios = require('axios');
const puppeteer = require('puppeteer-core');

bll();

async function bll(){
    const firstBrowser = await openBrowser('j9ts7qh');
    const secondBrowser = await openBrowser('jbra71l');

    const etherscanPage = await firstBrowser.newPage();
    await etherscanPage.goto('https://etherscan.io/');

    const textSelector = await etherscanPage.waitForSelector("#ContentPlaceHolder1_mainboxes > div > div:nth-child(1) > div:nth-child(1) > div.flex-grow-1 > a");
    const fullTitle = await textSelector?.evaluate(el => el.textContent);

    const translaterPage = await secondBrowser.newPage();
    await translaterPage.goto('https://translate.google.com/?sl=en&tl=ru&op=translate');

    let textArea = await translaterPage.waitForSelector('#yDmH0d > c-wiz > div > div.ToWKne > c-wiz > div.OlSOob > c-wiz > div.ccvoYb.EjH7wc > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.UnxENd > span > span > div > textarea');
    await textArea.type(fullTitle);

    console.log(fullTitle);
}

//open profile by profile id
async function openBrowser(profileId){
    try {
        const response = await axios.get(`http://local.adspower.net:50325/api/v1/browser/start?user_id=${profileId}`);
    
        if (response.data.code === 0 && response.data.data.ws && response.data.data.ws.puppeteer) {
            try {
                // Creating browser
                const browser = await puppeteer.connect({
                    browserWSEndpoint: response.data.data.ws.puppeteer,
                    defaultViewport: null
                });
                
                return browser;
            } catch (err) {
                console.log("You are stupid, browser with profile id " + profileId + 'is closed');
                console.log(err.message);
            }
        }
    } catch (err) {
        console.log(err);
    }
}