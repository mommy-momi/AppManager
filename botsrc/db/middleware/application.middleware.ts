import { ApplicationSchema } from "../models/application.model";
import { ServerController } from "../controllers/server/server.controller";
import { IApplicationModel } from "../formats/application.format";

// every time an application is saved to the schema, ensure that there is a server
// for that specific one and add the application to its list for ease of use
ApplicationSchema.post('save', async (application: IApplicationModel) => {
    await ServerController.Put.ensureServerExists(application.server as string);
    return await ServerController.Put.addApplication(application.server as string, application);
});