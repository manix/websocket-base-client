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
      this.reconnectTO = setTimeout(this.connect.bind(this), this.reconnect);
    }
  };

  wsBaseClient.prototype.connect = function () {
    /**
     * How many ms to wait before trying to reconnect. Set to 0 to disable.
     */
    this.reconnect = 30000;
    if (this.reconnectTO) {
      clearTimeout(this.reconnectTO);
    }

    /**
     * How many seconds to wait for ping from server
     */
    this.pingInterval = 30000;

    this.ws = this.construct.call(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.addEventListener("ping", this.onPing.bind(this));

    if (this.pingInterval > 0) {
      this.onPing()
    }
  };

  wsBaseClient.prototype.onPing = function () {
    if (this.pingTO) {
      clearTimeout(this.pingTO);
    }

    this.pingTO = setTimeout(() => this.ws.terminate(), this.pingInterval);
  }

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
