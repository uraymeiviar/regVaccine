
function init() {  
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(xmlHttp.response)
        }
    }
    var account = window.location.pathname.substring(1,window.location.pathname.lastIndexOf('/'));
    xmlHttp.open("GET", "/getAccountInfo?account="+account, true); 
    xmlHttp.send(null);
}