let uviasIDs = JSON.parse(localStorage.getItem("uvias_ids")) || {}; //uvias ids dont mean shit, dont abuse their reporting, theyre not dumb
if(!localStorage.uvias_ids) localStorage.setItem("uvias_ids", "{}");

function respond(message) {
    return addChat(null, 0, "user", "[ Uvias IDs ]", message, "Uvias IDS", 1, 1, 1, "#770077", Date.now());
}

w.on("cmd", (data) => {
    if(!data.id || !data.username) return;
    if(uviasIDs[data.username]) return;

    uviasIDs[data.username] = data.id;
    localStorage.setItem("uvias_ids", JSON.stringify(uviasIDs));

    respond(`Registered ID <a href='http://uvias.com/profile/${data.id}' style='color:#00f;text-decoration:underline'>${data.id}</a> as user ${data.username}`);
});

setTimeout(network.cmd_opt, 10000); //avoid transmission error

//TODO: Implement Managers.js bruh

client_commands.uviasids = () => {
    let string = "<br>";
    for(var i in uviasIDs) {
        string += `${i}: <a href='https://uvias.com/profile/${uviasIDs[i]}' style='color:#00f;text-decoration:underline'>${uviasIDs[i]}</a><br>`
    };

    respond(string);
};

function isBadID(id) {
    if(typeof id !== "string") return true;
    if(id.length !== 16) return true;
    if(/[^0-9A-F]/g.test(id)) return true;
    return false;
}

client_commands.manualid = ([id, username]) => {
    if(!id || !username) return respond(`Invalid ID/username`);
    if(isBadID(id)) return respond(`Invalid ID`);
    if(!isBadID(username)) return respond(`ID may be in username position (second argument)`); //just in case
    uviasIDs[username] = id;
    localStorage.setItem("uvias_ids", JSON.stringify(uviasIDs));
    respond(`Manually added ${id} as ${username}`);
}
client_commands.idof = ([username]) => {
    if(!(username in uviasIDs)) {
        return respond(`User "${username}"'s ID has not been logged`);
    };

    return respond(`ID of ${username}: ${uviasIDs[username]}`);
};

client_commands.fixdupes = () => {
    let fixedIDs = {};

    let ids = Object.values(uviasIDs);
    let usernames = Object.keys(uviasIDs);

    let originalLength = Object.keys(uviasIDs).length;

    for(var i = ids.length; i > 0; i--) {
        if(! Object.values(fixedIDs).includes(ids[i])) {
            fixedIDs[usernames[i]] = ids[i];
        };
    };

    ids = undefined;
    usernames = undefined;

    localStorage.setItem("uvias_ids", JSON.stringify(fixedIDs));
    return respond(`Deleted ${originalLength - Object.keys(fixedIDs).length} duplicate entries`);
};
