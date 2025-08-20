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
    if (changes.targetList) {
        sitesMap = new Map(changes.targetList.map(item => [item.id, item]));
        initializePopup();
    }
});

/**
 * Initializes the popup by populating the sites div with buttons for each item in the sitesMap.
 * Clears any existing elements in the sites div before adding new ones.
 * Adds event listeners to the created buttons and the "More Info" button.
 */
function initializePopup() {
    const targetsDiv = document.getElementById('sites');

    if (targetsDiv) {
        // Clear existing elements
        targetsDiv.innerHTML = '';

        // Create a new element for each item in sitesMap
        sitesMap.forEach((item, name) => {
            const newElement = document.createElement('button');
            newElement.className = 'target';
            newElement.type = 'button';
            newElement.id = `btn-${item.id}`;
            
            // Create favicon image if available
            if (item.favicon) {
                const favicon = document.createElement('img');
                favicon.src = item.favicon;
                favicon.className = 'favicon';
                favicon.alt = `${item.name} icon`;
                newElement.appendChild(favicon);
            }
            
            // Create text span for the name
            const textSpan = document.createElement('span');
            textSpan.textContent = item.name;
            textSpan.className = 'site-name';
            newElement.appendChild(textSpan);
            
            targetsDiv.appendChild(newElement);
        });
    }

    // Add event listeners to buttons
    const btns = [...document.getElementsByClassName("target")];
    btns.forEach(btn => { btn.addEventListener("click", handler); });
    btnMoreInfo.addEventListener("click", moreInfoHandler);
}

/**
 * Handles the click event from the sender element, retrieves the current active tab's URL,
 * extracts the search text from the URL, and opens a new tab with the search URL based on the sender's ID.
 *
 * @param {Object} sender - The object representing the element that triggered the event.
 * @param {Object} sender.srcElement - The source element that triggered the event.
 * @param {string} sender.srcElement.id - The ID of the source element.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
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

/**
 * Extracts the search text from a given URL based on predefined search query parameter identifiers.
 *
 * @param {string} url - The URL to extract the search text from.
 * @returns {Promise<string|undefined>} - A promise that resolves to the search text if found, otherwise undefined.
 */
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

/**
 * Handles the event when the More Info link is clicked.
 * Opens a new tab with the SearchSwap information page.
 *
 * @param {Object} sender - The sender object that triggered the event.
 * @returns {Promise<void>} - A promise that resolves when the tab is created.
 */
async function moreInfoHandler(sender) {
    chrome.tabs.create({ url: "https://gusperez.com/searchswap" })
}
