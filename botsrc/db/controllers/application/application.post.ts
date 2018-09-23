import { IApplication, IApplicationModel } from "../../formats/application.format";
import { model } from "mongoose";

const models = {
    Application: model<IApplicationModel>('application')
}

export const ApplicationPostController = {
    application: (applicationData: IApplication) => {
        const mongoApp = new models.Application(applicationData);
        return mongoApp.save();
    }
};