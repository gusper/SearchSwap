const btns = [...document.getElementsByClassName("target")];
btns.forEach(btn => { btn.addEventListener("click", handler); });

const targetList = new Map([ 
    ["bing", "https://www.bing.com/search?q=QQQ"],
    ["google", "https://www.google.com/search?q=QQQ"],
    ["ultimateguitar", "https://www.ultimate-guitar.com/search.php?search_type=title&value=QQQ"],
    ["stackoverflow", "https://stackoverflow.com/search?q=QQQ"],
    ["reddit", "https://www.reddit.com/search/?q=QQQ"],
    ["twitter", "https://twitter.com/search?q=QQQ"],
    ["duckduckgo", "https://duckduckgo.com/?q=QQQ"]
]);

async function handler(sender)
{
    console.log(sender.srcElement.id);
    let queryOptions = { active: true };
    let tab = await chrome.tabs.query(queryOptions);
    let searchText = await getSearchText(tab[0].url, "q");
    if (typeof searchText === "undefined")
        searchText = await getSearchText(tab[0].url, "value");
    let targetKey = sender.srcElement.id.substring(3).toLowerCase();
    let searchUrl = targetList.get(targetKey).replace("QQQ", searchText);
    chrome.tabs.create({ url: searchUrl })
}

async function getSearchText(url, variable) {
    let queryString = url.substring(url.indexOf("?") + 1, url.length);
    let vars = queryString.split('&');

    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}