// Saves options to chrome.storage
var siteList;

function save_options() {
    let color = document.getElementById('color').value;
    let likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
        favoriteColor: color,
        likesColor: likesColor,
        sites: siteList
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
        status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        favoriteColor: 'red',
        likesColor: true,
        sites: null
    }, function(items) {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;
        siteList = items.sites;
    
        console.log(siteList);

    });
}

function add_site() {
    let name = document.getElementById('txtName').value;
    let url = document.getElementById('txtUrl').value;
    
    if (!siteList) {
        siteList = new Map();
    }

    siteList.set(name, url);

    console.log(siteList);

    refresh_site_list();
}

function refresh_site_list() {
    let sl = document.getElementById('site-list');
    sl.textContent = "test";
}

// Set up event handlers
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('btnAddSite').addEventListener('click', add_site);