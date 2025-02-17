import { defaultTargetList } from '../common/common.js';

let sitesMap;

// Load site list from storage or use default list
chrome.storage.sync.get({ targetList: defaultTargetList }, function(data) {
    // If starting with default list, save it in storage
    if (data.targetList === defaultTargetList) {
        chrome.storage.sync.set({ targetList: defaultTargetList });
    }
    sitesMap = new Map(data.targetList.map(item => [item.id, item]));
    initializePopup();
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('In onChanged listener');
    if (changes.targetList) {
        sitesMap = new Map(changes.targetList.map(item => [item.id, item]));
        initializePopup();
    }
});

function initializePopup() {
    const targetsDiv = document.getElementById('targets');

    if (targetsDiv) {
        // Clear existing elements
        targetsDiv.innerHTML = '';

        // Create a new element for each item in targetList
        sitesMap.forEach((item, name) => {
            const newElement = document.createElement('button');
            newElement.textContent = item.name;
            newElement.className = 'target';
            newElement.type = 'button';
            newElement.id = `btn-${item.id}`;
            targetsDiv.appendChild(newElement);
        });
    }

    const btns = [...document.getElementsByClassName("target")];
    console.log('btns', btns);
    btns.forEach(btn => { 
        btn.addEventListener("click", handler); 
        console.log('btn.id', btn.id);
    });
    btnMoreInfo.addEventListener("click", moreInfoHandler);
}

async function handler(sender) {
    console.log('in handler(' + sender.srcElement.id + ')');
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log('tab.url', tab.url);
    let searchText = await getSearchText(tab.url);

    let targetKey = sender.srcElement.id.substring(4).toLowerCase();
    
    if (!searchText) {
        alert("Not finding search text in current tab's URL.");
        return;
    }
    
    let searchUrl = sitesMap.get(targetKey.toLowerCase()).url.replace("%s", searchText);
    chrome.tabs.create({ url: searchUrl })
}

async function getSearchText(url) {
    console.log('getSearchText(' + url + ')');
    let searchIdentifiers = ["q", "value", "search_query", "k"];
    let queryString = url.substring(url.indexOf("?") + 1, url.length);
    let vars = queryString.split('&');
    
    for (var i = 0; i < vars.length; i++) {
        for (let siIndex = 0; siIndex < searchIdentifiers.length; siIndex++) {
            let pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === searchIdentifiers[siIndex]) {
                return decodeURIComponent(pair[1]);
            }
        }
    }
}

async function moreInfoHandler(sender) {
    chrome.tabs.create({ url: "https://gusperez.com/searchswap" })
}
