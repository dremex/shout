var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("quit", function(data) {
		network.channels.forEach(function(chan) {
			var user = _.findWhere(chan.users, {name: data.nick});
			if (typeof user === "undefined") {
				return;
			}
			chan.users = _.without(chan.users, user);
			client.emit("users", {
				chan: chan.id,
				users: chan.users
			});
			var splitQuitMessage = data.message.split("Quit: ");
			var msg = new Msg({
				type: Msg.Type.QUIT,
				from: data.nick,
				text: splitQuitMessage[1]
			});
			chan.messages.push(msg);
			client.emit("msg", {
				chan: chan.id,
				msg: msg
			});
		});
	});
};
