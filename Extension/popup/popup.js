/**
 * Register event handlers
 */
document.getElementById("myButton").addEventListener("click", handler);

/**
 * Click event handler
 */
async function handler()
{
    let queryOptions = { active: true };
    let tab = await chrome.tabs.query(queryOptions);
    let searchText = await getSearchText(tab[0].url, "q");

    alert("q: " + searchText);
}

/**
 * Takes a URL returns the specified argument's value.
 */
async function getSearchText(url, variable) {
    let queryString = url.substring(url.indexOf("?") + 1, url.length);
    let vars = queryString.split('&');

    for (var i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    
    console.log("Query variable '%s' not found", variable);
}