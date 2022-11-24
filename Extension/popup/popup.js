console.log("This is a popup!");

document.getElementById("myButton").addEventListener("click", handler);

function handler()
{
    console.log("Clicked!");
    alert("clicked");
}