const btns = [...document.getElementsByClassName("target")];
btns.forEach(btn => { btn.addEventListener("click", handler); });
btnMoreInfo.addEventListener("click", moreInfoHandler);

const targetList = new Map([
    ["amazon", "https://www.amazon.com/s?k=%s"],
    ["bing", "https://www.bing.com/search?q=%s"],
    ["duckduckgo", "https://duckduckgo.com/?q=%s"],
    ["github", "https://github.com/search?q=%s&ref=opensearch"],
    ["google", "https://www.google.com/search?q=%s"],
    ["reddit", "https://www.reddit.com/search/?q=%s"],
    ["stackoverflow", "https://stackoverflow.com/search?q=%s"],
    ["superuser", "https://superuser.com/search?q=%s"],
    ["twitter", "https://twitter.com/search?q=%s"],
    ["ultimateguitar", "https://www.ultimate-guitar.com/search.php?search_type=title&value=%s"],
    ["youtube", "https://www.youtube.com/results?search_query=%s&page={startPage?}&utm_source=opensearch"],
    ["hackernews", "https://hn.algolia.com/?q=%s"]
]);

async function handler(sender)
{
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    let searchText = await getSearchText(tab.url);
    let targetKey = sender.srcElement.id.substring(3).toLowerCase();
    
    if (!searchText) {
        alert("Not finding search text in current tab's URL.");
        return;
    }
    
    let searchUrl = targetList.get(targetKey).replace("%s", searchText);
    chrome.tabs.create({ url: searchUrl })
}

async function getSearchText(url) {
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

async function moreInfoHandler(sender)
{
    chrome.tabs.create({ url: "https://gusperez.com/searchswap" })
}