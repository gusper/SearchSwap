const defaultTargetList = [
    ["amazon", "https://www.amazon.com/s?k=%s"],
    ["bing", "https://www.bing.com/search?q=%s"],
    ["bluesky", "https://bsky.app/search?q=%s"],
    ["duckduckgo", "https://duckduckgo.com/?q=%s"],
    ["github", "https://github.com/search?q=%s&ref=opensearch"],
    ["google", "https://www.google.com/search?q=%s"],
    ["hackernews", "https://hn.algolia.com/?q=%s"],
    ["mastodon", "https://mastodon.social/search?q=%s"],
    ["reddit", "https://www.reddit.com/search/?q=%s"],
    ["stackoverflow", "https://stackoverflow.com/search?q=%s"],
    ["superuser", "https://superuser.com/search?q=%s"],
    ["twitter", "https://twitter.com/search?q=%s"],
    ["ultimateguitar", "https://www.ultimate-guitar.com/search.php?search_type=title&value=%s"],
    ["youtube", "https://www.youtube.com/results?search_query=%s&page={startPage?}&utm_source=opensearch"]
];

let targetList;
console.log(targetList);

chrome.storage.sync.get({ targetList: defaultTargetList }, function(data) {
    if (data.targetList === null || data.targetList.length === 0) {
        chrome.storage.sync.set({ targetList: defaultTargetList });
    }
    console.log(targetList);
    targetList = new Map(data.targetList);
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
        targetList.forEach((url, name) => {
            const newElement = document.createElement('button');
            newElement.textContent = name;
            newElement.className = 'target';
            newElement.type = 'button';
            newElement.id = `btn-${name.toLowerCase()}`;
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
    
    let searchUrl = targetList.get(targetKey.toLowerCase()).replace("%s", searchText);
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
