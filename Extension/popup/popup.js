console.log("This is a popup!");

document.getElementById("myButton").addEventListener("click", handler);

async function handler()
{
    let queryOptions = { active: true };
    let tab = await chrome.tabs.query(queryOptions);
    
    console.log("Clicked: " + tab[0].url);
    alert("Clicked: " + tab[0].url);
}