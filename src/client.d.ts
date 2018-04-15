interface wsBaseClient {

  public ws: Websocket;

  constructor(construct: () => WebSocket);
  onMessage(m: any): void;
  onClose(): void;
  connect(): void;
  send(command: string, body: any, id: string | number): void;
}

type wsBaseAction = function(this: wsBaseClient, body, id): void;
type wsBaseActions = {
  [key: string]: wsBaseAction
};

export default function (actions: wsBaseActions): wsBaseClient;