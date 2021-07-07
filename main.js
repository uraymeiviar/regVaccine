const express = require('express');
const fs = require('fs');
const url = require('url');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 3000;

var session = {}

function getAccount(account) {
    if (account.length > 0) {
        let accountFile = fs.readFileSync('account.json');
        let accountInfo = JSON.parse(accountFile);
        if (accountInfo.hasOwnProperty(account)) {
            if (accountInfo[account].hasOwnProperty("data")) {
                let accountDataFile = accountInfo[account].data;
                let accountDataContent = fs.readFileSync(accountDataFile);
                try {
                    let accountDataJson = JSON.parse(accountDataContent);
                    return accountDataJson;
                } catch (e) {
                    return null;
                }
            }
        }
    }
}

function saveAccount(accountData) {
    if (accountData.hasOwnProperty("filename")) {
        try {
            fs.writeFileSync(accountData.filename, JSON.stringify(accountData, null, 4), { encoding: 'utf8', flag: 'w' })
            return true;
        } catch (err) {
            console.error(err)
            return false;
        }
    }
    return false;
}

function createSession(accountData, sessionData) {
    var sessionData = {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        account: sessionData["account"],
        name: sessionData["name"],
        maxRegistrant: sessionData["maxRegistrant"],
        currentRegistrant: 0,
        completed: 0,
        pending: 0,
        sessionRunning: false,
        regOpen: sessionData["regOpen"],
        regEnd: sessionData["regEnd"],
        createDate: sessionData["createDate"],
        sessionStart: sessionData["sessionStart"],
        sessionEnd: sessionData["sessionEnd"],
        dataFile: sessionData["account"] + "-" + sessionData["name"] + ".json"
    }

    //TODO: input chars validations

    if (sessionData.name.length <= 0) {
        return {
            result: false,
            reason: "name undefined"
        }
    }
    if (sessionData.account != accountData.account) {
        return {
            result: false,
            reason: "invalid account name"
        }
    }
    if (sessionData.regEnd > sessionData.sessionStart) {
        return {
            result: false,
            reason: "invalid regEnd timestamp"
        }
    }
    if (sessionData.sessionStart > sessionData.sessionEnd) {
        return {
            result: false,
            reason: "invalid sessionStart timestamp"
        }
    }
    if (sessionData.createDate > sessionData.regEnd) {
        return {
            result: false,
            reason: "invalid creation timestamp"
        }
    }
    if (accountData.sessions.hasOwnProperty(sessionData.name)) {
        return {
            result: false,
            reason: "session name already exists"
        }
    }
    if (sessionData.regOpen && accountData.activeSession != "") {
        return {
            result: false,
            reason: "active registration session still open"
        }
    }

    accountData.sessions[sessionData.name] = sessionData;
    if (saveAccount(accountData)) {
        return {
            result: true,
            data: sessionData
        };
    } else {
        delete accountData.sessions[sessionData.name];
        return {
            result: false,
            reason: "failed to write data"
        }
    }
}

app.get('/listAccount', function(req, res) {
    let accountFile = fs.readFileSync('account.json');
    try {
        let accountData = JSON.parse(accountFile);
        res.send(Object.keys(accountData));
    } catch (e) {
        res.status(503).send(e);
    }
})

app.get('/getAccountInfo', function(req, res) {
    var url = new URL(req.url, req.protocol + '://' + req.headers.host + '/');
    if (url.searchParams.has("account")) {
        var account = url.searchParams.get("account")
        console.log("/getAccountInfo " + account);
        var accountDataJson = getAccount(account);
        if (accountDataJson != null) {
            delete accountDataJson["superadminpwd"];
            delete accountDataJson["adminpwd"];
            res.send(accountDataJson);
            return
        }
    }
    res.status(404).send("request error");
})

app.post("/login", function(req, res) {
    var url = new URL(req.url, req.protocol + '://' + req.headers.host + '/');
    if (url.searchParams.has("account")) {
        var account = url.searchParams.get("account")
        if (url.searchParams.has("pwd")) {
            var pwd = url.searchParams.get("pwd")
            console.log("/login " + account + "by pwd");
            var accountDataJson = getAccount(account);
            if (accountDataJson != null) {
                if (accountDataJson.hasOwnProperty("superadminpwd")) {
                    if (accountDataJson["superadminpwd"] == pwd) {
                        let randStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        session[randStr] = {
                            type: "superadmin",
                            loginTime: Date.now(),
                            account: account,
                            key: randStr
                        }
                        res.status(200).send(session[randStr]);
                        console.log("/login " + account + " key " + randStr + " as superadmin success");
                        return
                    }
                }
                if (accountDataJson.hasOwnProperty("adminpwd")) {
                    if (accountDataJson["adminpwd"] == pwd) {
                        let randStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                        session[randStr] = {
                            type: "admin",
                            loginTime: Date.now(),
                            account: account,
                            key: randStr
                        }
                        res.status(200).send(session[randStr]);
                        console.log("/login " + account + " key " + randStr + " as admin success");
                        return
                    }
                }
                res.status(503).send("invalid password");
                return
            } else {
                res.status(503).send("invalid account");
                return
            }
        } else if (url.searchParams.has("key")) {
            var key = url.searchParams.get("key")
            console.log("/login " + account + " key " + key);
            var accountDataJson = getAccount(account);
            if (accountDataJson != null) {
                if (session.hasOwnProperty(key)) {
                    if (session[key].account == account) {
                        var currentTime = Date.now();
                        const diffTime = Math.abs(currentTime - session[key].loginTime);
                        const diffDays = diffTime / (1000 * 60 * 60 * 24);
                        if (diffDays > 1) {
                            console.log("/login " + account + " key " + key + " expired");
                            delete session[key];
                            res.status(404).send("session expired");
                            return
                        } else {
                            res.status(200).send(session[key]);
                            console.log("/login " + account + " key " + key + " success");
                            return
                        }
                    }
                } else {
                    res.status(503).send("session not found");
                    console.log("/login " + account + " key " + key + " not found");
                    return
                }
            }
        }
    }
    res.status(404).send("request error");
})

app.post("/createSession", function(req, res) {
    if (req.body.hasOwnProperty("account")) {
        var account = req.body["account"]
        if (req.body.hasOwnProperty("key")) {
            var key = req.body["key"]
            console.log("/createSession " + account + " key " + key);
            var accountDataJson = getAccount(account);
            if (accountDataJson != null) {
                if (session.hasOwnProperty(key)) {
                    if (session[key].account == account) {
                        var currentTime = Date.now();
                        const diffTime = Math.abs(currentTime - session[key].loginTime);
                        const diffDays = diffTime / (1000 * 60 * 60 * 24);
                        if (diffDays > 1) {
                            console.log("/createSession " + account + " key " + key + " expired");
                            delete session[key];
                            res.status(404).send("session expired");
                            return
                        } else {
                            var result = createSession(accountDataJson, req.body);
                            if (result != null) {
                                res.status(200).send(result);
                                console.log("/createSession " + account + " key " + key + " success");
                                return
                            } else {
                                res.status(503).send("session creation failed");
                                console.log("/createSession " + account + " key " + key + " failed");
                                return
                            }
                        }
                    } else {
                        res.status(503).send("invalid account");
                        console.log("/createSession " + account + " key " + key + " invalid account");
                        return
                    }
                } else {
                    res.status(503).send("session not found");
                    console.log("/createSession " + account + " key " + key + " not found");
                    return
                }
            }
        }
    }
    res.status(404).send("request error");
});
app.use(express.static('web'))

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));