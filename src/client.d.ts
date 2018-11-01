declare class wsBaseClient {

  ws: WebSocket;
  reconnect: number;
  reconnectTO: number;
  pingInterval: number;
  pingTO: number;

  constructor(construct: () => WebSocket);
  onMessage(m: any): void;
  onClose(): void;
  connect(): void;
  send(command: string, body?: any, id?: string | number): void;
}

type wsBaseActions = {
  [key: string]: (this: wsBaseClient, body: any, id: string | number) => void
};

export default function (actions: wsBaseActions): typeof wsBaseClient;