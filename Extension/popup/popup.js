const defaultTargetList = [
    ["amazon", { displayName: "Amazon", url: "https://www.amazon.com/s?k=%s" }],
    ["bing", { displayName: "Bing", url: "https://www.bing.com/search?q=%s" }],
    ["bluesky", { displayName: "Bluesky", url: "https://bsky.app/search?q=%s" }],
    ["duckduckgo", { displayName: "Duck Duck Go", url: "https://duckduckgo.com/?q=%s" }],
    ["github", { displayName: "GitHub", url: "https://github.com/search?q=%s&ref=opensearch" }],
    ["google", { displayName: "Google", url: "https://www.google.com/search?q=%s" }],
    ["hackernews", { displayName: "Hacker News", url: "https://hn.algolia.com/?q=%s" }],
    ["mastodon", { displayName: "Mastodon", url: "https://mastodon.social/search?q=%s" }],
    ["reddit", { displayName: "Reddit", url: "https://www.reddit.com/search/?q=%s" }],
    ["stackoverflow", { displayName: "Stack Overflow", url: "https://stackoverflow.com/search?q=%s" }],
    ["superuser", { displayName: "Super User", url: "https://superuser.com/search?q=%s" }],
    ["x", { displayName: "X", url: "https://x.com/search?q=%s" }],
    ["ultimateguitar", { displayName: "Ultimate Guitar", url: "https://www.ultimate-guitar.com/search.php?search_type=title&value=%s" }],
    ["youtube", { displayName: "YouTube", url: "https://www.youtube.com/results?search_query=%s&page={startPage?}&utm_source=opensearch" }]
];

let targetList;
console.log('targetList >'); 
console.log(targetList);

// Load site list from storage or use default list
chrome.storage.sync.get({ targetList: Array.from(defaultTargetList) }, function(data) {
    if (data.targetList === null || data.targetList.length === 0) {
        chrome.storage.sync.set({ targetList: Array.from(defaultTargetList) });
    }
    targetList = new Map(data.targetList);
    console.log('targetList >'); 
    console.log(targetList);
    initializePopup();
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log('In onChanged listener');
    if (changes.targetList) {
        targetList = new Map(changes.targetList.newValue);
        initializePopup();
    }
});

function initializePopup() {
    const targetsDiv = document.getElementById('targets');

    if (targetsDiv) {
        // Clear existing elements
        targetsDiv.innerHTML = '';

        // Create a new element for each item in targetList
        targetList.forEach((item, name) => {
            const newElement = document.createElement('button');
            newElement.textContent = item.displayName;
            newElement.className = 'target';
            newElement.type = 'button';
            newElement.id = `btn-${name}`;
            targetsDiv.appendChild(newElement);
        });
    }

    const btns = [...document.getElementsByClassName("target")];
    console.log(btns);
    btns.forEach(btn => { 
        btn.addEventListener("click", handler); 
        console.log(btn.id);
    });
    btnMoreInfo.addEventListener("click", moreInfoHandler);
}

async function handler(sender) {
    console.log('in handler(' + sender.srcElement.id + ')');
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log('tab.url = ' + tab.url);
    let searchText = await getSearchText(tab.url);

    let targetKey = sender.srcElement.id.substring(4).toLowerCase();
    
    if (!searchText) {
        alert("Not finding search text in current tab's URL.");
        return;
    }
    
    let searchUrl = targetList.get(targetKey.toLowerCase()).url.replace("%s", searchText);
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
