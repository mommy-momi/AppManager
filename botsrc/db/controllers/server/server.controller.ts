import { ServerPostController } from "./server.post";
import { ServerPutController } from "./server.put";
import { ServerGetController } from "./server.get";

export const ServerController = {
    Post: ServerPostController,
    Put: ServerPutController,
    Get: ServerGetController
};