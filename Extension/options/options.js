import { defaultTargetList } from '../common/common.js';
import { utils } from '../common/common.js';

document.addEventListener('DOMContentLoaded', function() {
    const targetForm = document.getElementById('targetForm');
    const targetListElement = document.getElementById('targetList');

    chrome.storage.sync.get({ targetList: [] }, function(data) {
        const targetList = new Map(data.targetList);
        renderTargetList(targetList);
        utils.cl('targetList', targetList);
    });

    targetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const targetName = document.getElementById('targetName').value.toLowerCase();
        const targetUrl = document.getElementById('targetUrl').value;

        chrome.storage.sync.get({ targetList: [] }, function(data) {
            const targetList = new Map(data.targetList);
            targetList.set(targetName, targetUrl);
            chrome.storage.sync.set({ targetList: Array.from(targetList) }, function() {
                renderTargetList(targetList);
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
                chrome.storage.sync.set({ targetList: Array.from(targetList) }, function() {
                    renderTargetList(targetList);
                });
            });
            li.appendChild(deleteButton);
            
            targetListElement.appendChild(li);
        });
    }
});