import { defaultTargetList } from '../common/common.js';
import { utils } from '../common/common.js';

document.addEventListener('DOMContentLoaded', function() {
    const targetForm = document.getElementById('targetForm');
    const targetListElement = document.getElementById('targetList');

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
            sitesMap.set(siteID, { name: siteID, displayName: siteName, url: siteUrl });
            chrome.storage.sync.set({ targetList: Array.from(sitesMap.values()) }, function() {
                renderTargetList(sitesMap);
            });
        });
    });

    function renderTargetList(targetList) {
        targetListElement.innerHTML = '';
        targetList.forEach((item, name) => {
            const li = document.createElement('li');
            li.textContent = `${item.displayName}: ${item.url}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                targetList.delete(name);
                chrome.storage.sync.set({ targetList: Array.from(targetList.values()) }, function() {
                    renderTargetList(targetList);
                });
            });
            li.appendChild(deleteButton);
            
            targetListElement.appendChild(li);
        });
    }

    function createID(name) {
        return name.toLowerCase().replaceAll(' ', '');
    }
});