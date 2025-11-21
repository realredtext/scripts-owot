let ranks = JSON.parse(localStorage.getItem("ranks")) ?? {};

w.on("chatmod", (e) => {
    if(ranks[e.realUsername]) {
        e.dataObj.rankName = ranks[e.realUsername][0];
        e.dataObj.rankColor = ranks[e.realUsername][1];
    };
});

let { ManagerCommandWrapper } = use("realredtext/scripts-owot/managers.js");

let rankManager = new ManagerCommandWrapper("Ranks", "#00b000", {
    "set": (user, color, ...content) => {
        if(!user || !(content.join(" ")) || !color) {
            return `Bad/missing parameters, should be /rank (user) (#color) (rank content)`;
        };

        if(!color.startsWith("#")) color = "#"+color;
        if(color.length !== 7) return `Bad color`;

        ranks[user] = [content.join(""), color];

        if(JSON.stringify(ranks) !== "{}") {
            localStorage.setItem("ranks", JSON.stringify(ranks));
        }

        return `Given rank "${content.join(' ')}" to ${user}`;
    },
    "remove": (user) => {
        if(!user) {
            return `No user given`;
        };
        if(!ranks[user]) {
            return `${user} has no rank`;
        }

        delete ranks[user];
        return `Removed rank from ${user}`;
    },
    "list": () => {
        if(!Object.keys(ranks).length) {
            return `No ranks assigned`;
        };
        let out = "<br>";
        for(var i in ranks) {
            out += `${i}: Content "${ranks[i][0]}", color ${ranks[i][1]}<br>`;
        };
        return out;
    },
    "view": (user) => {
        if(!user) return `No user given`;

        if(!ranks[user]) return `This user has no rank`;
        return `<b style="color: ${ranks[user][1]}">(${ranks[user][0]})</b>`;
    }
}, "rank", ["view", "list"]);
