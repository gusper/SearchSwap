import { defaultTargetList } from '../common/common.js';

document.addEventListener('DOMContentLoaded', function() {
    const targetForm = document.getElementById('targetForm');
    const siteListElement = document.getElementById('siteList');

    chrome.storage.sync.get({ targetList: defaultTargetList }, function(data) {
        const sitesMap = new Map(data.targetList.map(item => [item.name, item]));
        renderTargetList(sitesMap);
        console.log('sitesMap', sitesMap);
    });

    targetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const siteID = createID(document.getElementById('targetName').value);
        const siteName = document.getElementById('targetName').value;
        const siteUrl = document.getElementById('targetUrl').value;

        chrome.storage.sync.get({ targetList: defaultTargetList }, function(data) {
            const sitesMap = new Map(data.targetList.map(item => [item.name, item]));
            sitesMap.set(siteID, { id: siteID, name: siteName, url: siteUrl, favicon: null });
            chrome.storage.sync.set({ targetList: Array.from(sitesMap.values()) }, function() {
                renderTargetList(sitesMap);
            });
        });
    });

    /**
     * Renders a list of sites into the target list element.
     * Each item is displayed with its name and URL, along with a delete button.
     * When the delete button is clicked, the item is removed from the list and the updated list is saved to Chrome storage.
     *
     * @param {Map} sitesMap - A Map object containing the target items to be rendered. 
     *                         Each item should have a 'name' and 'url' property.
     */
    function renderTargetList(sitesMap) {
        siteListElement.innerHTML = '';
        sitesMap.forEach((item, name) => {
            const li = document.createElement('li');
            li.innerHTML = `<b>${item.name}</b>: ${item.url}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', function() {
                sitesMap.delete(name);
                chrome.storage.sync.set({ targetList: Array.from(sitesMap.values()) }, function() {
                    renderTargetList(sitesMap);
                });
            });
            li.appendChild(deleteButton);
            
            siteListElement.appendChild(li);
        });
    }

    /**
     * Creates an ID by converting the given name to lowercase and removing all spaces.
     *
     * @param {string} name - The name to be converted into an ID.
     * @returns {string} The generated ID.
     */
    function createID(name) {
        return name.toLowerCase().replaceAll(' ', '');
    }
});