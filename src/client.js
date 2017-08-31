module.exports = function (actions) {
  "use strict";

  function wsBaseClient(construct) {
    this.construct = construct;
    this.connect();
  }

  wsBaseClient.prototype.onMessage = function (m) {
    try {
      var data = JSON.parse(m.data);

      actions[data[0]].call(this, data[1], data[2]);
    } catch (e) {
      console.error(e);
    }
  };

  wsBaseClient.prototype.onClose = function () {
    if (this.reconnect) {
      setTimeout(this.connect.bind(this), this.reconnect);
    }
  };

  wsBaseClient.prototype.connect = function () {
    this.ws = this.construct();
    /**
     * How many ms to wait before trying to reconnect. Set to 0 to disable.
     */
    this.reconnect = 30000;

    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  };

  wsBaseClient.prototype.send = function (command, body, id) {
    var data = [command];

    if (body || id) {
      data.push(body);

      if (id) {
        data.push(id);
      }
    }

    this.ws.send(JSON.stringify(data));
  };

  return wsBaseClient;
};
