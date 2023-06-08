//import browser from "../browser/webextension-polyfill";

console.log('serviceWorker script loaded');

if (typeof browser === "undefined") {
    var browser = chrome;
}

browser.tabs.onActivated.addListener(info => {
    getUrl(info.tabId);
})

browser.tabs.onUpdated.addListener((tab) => {
    getUrl(tab);

})

function getUrl(tabId) {
    setTimeout(() => {
        browser.tabs.get(tabId)
            .then(tab => {
                if (tab) {
                    checkUrl(tab.url);
                } else {
                    getUrl(tabId);
                }
            })
            .catch(err => console.log(err))
    }, 100);
}

function checkUrl(tabUrl) {

    const org_re = /https:\/\/(manage|integration|manage-staging)\.(?<host>[a-z0-9.]*(mist|mistsys)\.com)\/admin\/\?org_id=(?<org_id>[0-9a-f-]*)#!/yis;
    const org = org_re.exec(tabUrl);
    const msp_re = /https:\/\/(manage|integration|manage-staging)\.(?<host>[a-z0-9.]*(mist|mistsys)\.com)\/msp\/\?msp=(?<msp_id>[0-9a-f-]*)#!/yis;
    const msp = msp_re.exec(tabUrl);
    const api_re = /https:\/\/api\.(?<host>[a-z0-9.]*(mist|mistsys)\.com)\/api\/v1\/(?<scope>const|installer|invite|login|logout|mobile|msps|orgs|recover|register|self|sites|utils)/yis;
    const api = api_re.exec(tabUrl);

    if (org || msp) {
        apiBadge(true, false);
    } else if (api) {
        apiBadge(false, true);
    } else {
        apiBadge(false, false);
    }
}

function apiBadge(showManage, showDjango) {
    if (showManage) {
        browser.browserAction.setBadgeBackgroundColor({ color: "#4caf50" })
        browser.browserAction.setBadgeText({ "text": "\u2713" });
    } else if (showDjango) {
        browser.browserAction.setBadgeBackgroundColor({ color: "#f38019" })
        browser.browserAction.setBadgeText({ "text": "\u2713" });
    } else {
        browser.browserAction.setBadgeText({ "text": "" });
    }
}