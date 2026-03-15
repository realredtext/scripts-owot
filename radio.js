let frequency = "100.0";
let radioSocketChannel = "";
const radioOnopen = function() {
	radioSocket.send(JSON.stringify({
		kind: "cmd_opt"
	}));
};
const radioOnmessage = function(msg) {
	let data = JSON.parse(msg.data);
	if(data.kind === "channel") radioSocketChannel = data.sender;
	if(data.kind !== "cmd") return;
	if(data.sender === radioSocketChannel) return;
	
	radioManager.core.send(`Received: ${data.data}`);
};

let radioSocket = new ReconnectingWebSocket(`wss://ourworldoftext.com/w/${frequency}/ws/`);
radioSocket.binaryType = "arraybuffer";

radioSocket.onmessage = radioOnmessage;
radioSocket.onopen = radioOnopen;

function isGoodFrequency(freq) {
	if(!freq) return !1;
	if(Number.isNaN(Number(freq))) return !1;
	if(freq.length < 4 || freq.length > 5) return !1;
	if(/[^0-9\.]/g.test(freq)) return !1;
	if(!freq.includes(".")) return !1;
	if(freq.startsWith("0")) return !1;
	if(Number(freq) < 80 || Number(freq) > 120) return !1;
	if(Number(freq) < 100 && freq.length > 4) return !1;
	if(freq.split(".").length !== 2) return !1;
	if(freq.split(".")[1].length > 1) return !1;
	if(freq.endsWith(".")) return !1;
	
	return !0;
};

function changeFrequency(freq) {
	if(!isGoodFrequency(freq)) return;
	
	frequency = freq;
	radioSocket.close();
	radioSocket = new ReconnectingWebSocket(`wss://ourworldoftext.com/w/${frequency}/ws/`);
	radioSocket.onmessage = radioOnmessage;
	radioSocket.onopen = radioOnopen;
};

let { ManagerCommandWrapper } = use("realredtext/scripts-owot/managers.js");

let radioManager = new ManagerCommandWrapper("Radio", "#006b00", {
	"transmit": (...message) => {
		let msg = message.join(" ");
		radioSocket.send(JSON.stringify({
			kind: "cmd",
			data: msg
		}));
		return `Message transmitted`;
	},
	"tune": (frq) => {
		if(!isGoodFrequency(frq)) return `Invalid frequency`;
		changeFrequency(frq);
		return `Tuned to ${frq}`;
	}
}, "radio", []);
