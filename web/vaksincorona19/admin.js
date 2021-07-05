var loginData = null;
var accountData = null;

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getAccount(){
    return window.location.pathname.substring(1,window.location.pathname.lastIndexOf('/'))
}

function getAccountInfo(callback, errCallback = null){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var respJson = null;
            try{
                respJson = JSON.parse(xmlHttp.response)
            }
            catch(e){
                if(errCallback){
                    errCallback(e)
                }                
            }
            callback(respJson);
        }
    }
    xmlHttp.open("GET", "/getAccountInfo?account="+getAccount(), true); 
    xmlHttp.send(null);
}

function loginFailed(message){
    document.getElementById("loginPasswdDesc").innerText = message;
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("adminPage").style.display = "none";
    document.getElementById("loginBtn").style.display = "block";
}

function loginSucess(key){
    if(key != null){
        setCookie("reg"+getAccount(),key,1)
    }
    document.getElementById("loginPasswdDesc").innerText = "";
    document.getElementById("loginBtn").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("adminPage").style.display = "block";
    document.getElementById("loginName").innerText = loginData.type;
}

function login(){
    getAccountInfo((data) => {
        accountData = data;
        console.log(accountData)
        if(accountData){
            document.getElementById("emailContact").innerText = accountData.contactEmail;
            document.getElementById("phoneContact").innerText = accountData.contactPhone;
            var sessionKey = getCookie("reg"+getAccount())
            if(sessionKey != null){
                console.log("available cookie "+sessionKey);
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() { 
                    if (xmlHttp.readyState == 4){
                        console.log(xmlHttp.response);
                        if(xmlHttp.status == 200){
                            try{
                                var responseData = JSON.parse(xmlHttp.response);
                                if(responseData.hasOwnProperty("key")){
                                    loginData = responseData;
                                    loginSucess(responseData.key);
                                }else{
                                    eraseCookie("reg"+getAccount());
                                    loginFailed("");
                                }        
                            }       
                            catch(e){
                                eraseCookie("reg"+getAccount());
                                loginFailed("");
                            }                       
                        }
                        else{
                            eraseCookie("reg"+getAccount());
                            loginFailed("");
                        }
                    }
                }
                xmlHttp.open("POST", "/login?account="+getAccount()+"&key="+sessionKey, true); 
                xmlHttp.send(null);
            }
            else if(document.getElementById("loginPasswd").value.length > 0 && loginData == null){
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function() { 
                    if (xmlHttp.readyState == 4){
                        console.log(xmlHttp.response);
                        if(xmlHttp.status == 200){  
                            try{
                                var responseData = JSON.parse(xmlHttp.response);
                                if(responseData.hasOwnProperty("key")){
                                    loginData = responseData;
                                    loginSucess(responseData.key)
                                }else{
                                    eraseCookie("reg"+getAccount());
                                    loginFailed("unknown error");
                                }  
                            }        
                            catch(e){
                                eraseCookie("reg"+getAccount());
                                loginFailed("unknown error");
                            }                            
                        }
                        else{
                            eraseCookie("reg"+getAccount());
                            loginFailed(xmlHttp.response);
                        }
                    }
                }
                xmlHttp.open("POST", "/login?account="+getAccount()+"&pwd="+document.getElementById("loginPasswd").value, true); 
                xmlHttp.send(null);
            }else{
                document.getElementById("loginBtn").style.display = "block";
            }
        }
    })
    if(loginData != null){
        document.getElementById("loginPasswdDesc").innerText = "";
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("adminPage").style.display = "block";
        document.getElementById("loginName") = loginData.type;
    }
    else{
        document.getElementById("loginBtn").style.display = "none";   
    } 
}

function createNewSessionClick(element){
    element.style.display = "none";
    document.getElementById("createSessionForm").style.display = "block";
}

function cancelCreateSession(element){
    document.getElementById("createNewSessionBtn").style.display = "inline-block";
    document.getElementById("createSessionForm").style.display = "none";
}

function updateContactClick(element){
    element.style.display = "none";
    document.getElementById("contactForm").style.display = "block";
}

function cancelUpdateContact(element){
    document.getElementById("updateContactBtn").style.display = "inline-block";
    document.getElementById("contactForm").style.display = "none";
}

function createSession(){
    document.getElementById("createSessionBtn").style.display = "none";
    var nameElement = document.getElementById("newSessionName");
    var startElement = document.getElementById("newSessionStart");
    var endElement = document.getElementById("newSessionEnd");
    var maxElement = document.getElementById("newSessionMaxReg");
    var regEndElement = document.getElementById("newSessionRegClose");
    var startRegElement = document.getElementById("openReg");
    var errField = document.getElementById("errorField");

    if(nameElement.value.length <= 0){
        errField.innerText = "Nama Sesi harus diisi";
        document.getElementById("createSessionBtn").style.display = "inline-block";
        return
    }

    var sessionStartDate = new Date(startElement.value);
    if(isNaN(sessionStartDate.getDate())){
        errField.innerText = "Jadwal mulai sesi harus diisi";
        document.getElementById("createSessionBtn").style.display = "inline-block";
        return
    }

    var sessionEndDate = new Date(endElement.value);
    if(isNaN(sessionEndDate.getDate())){
        errField.innerText = "Jadwal akhir sesi harus diisi";
        document.getElementById("createSessionBtn").style.display = "inline-block";
        return
    }

    var sessionDuration = sessionEndDate - sessionStartDate;
    if(sessionDuration < 1000*60*60){
        errField.innerText = "Waktu berakhir sesi harus lebih akhir daripada start sesi dan diatas 1 jam";
        document.getElementById("createSessionBtn").style.display = "inline-block";
        return
    }

    var maxRegistrant = maxElement.value;
    if(maxRegistrant < 0){
        maxRegistrant = 0;
    }

    var regEndDate = new Date(regEndElement.value);
    if(isNaN(regEndDate.getDate())){
        errField.innerText = "Batas akhir registrasi harus diisi";
        document.getElementById("createSessionBtn").style.display = "inline-block";
        return
    }

    var endOfRegToStartElapse = sessionStartDate - regEndDate;
    if(endOfRegToStartElapse < 1000){
        errField.innerText = "Jadwal mulai sesi harus setelah registrasi ditutup";
        document.getElementById("createSessionBtn").style.display = "inline-block";
        return
    }

    //TODO: check for existing session name
    //TODO: check for active registration session
    //TODO: input chars validations -> myString.replace(/[^a-z0-9 ,.?!]/ig, '')

    errField = "";

    regData = {}
    regData["name"] = nameElement.value;
    regData["sessionStart"] = sessionStartDate.getTime();
    regData["sessionEnd"] = sessionEndDate.getTime();
    regData["regEnd"] = regEndDate.getTime();
    regData["maxRegistrant"] = maxRegistrant;
    regData["regOpen"] = startRegElement.checked  ? true : false;
    regData["createDate"] = Date.now()
    regData["account"] = loginData.account;
    regData["key"] = loginData.key;

    console.log(regData);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var respJson = null;
            try{
                respJson = JSON.parse(xmlHttp.response)
                console.log(respJson);
            }
            catch(e){
                console.log(e);              
            }
            document.getElementById("createSessionBtn").style.display = "inline-block";
        }
    }
    xmlHttp.open("POST", "/createSession", true); 
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify(regData));

    
}