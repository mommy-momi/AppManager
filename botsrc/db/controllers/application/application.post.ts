import { IApplication, IApplicationModel } from "../../formats/application.format";
import { model } from "mongoose";
import { Controller } from "../base";

const models = {
    Application: model<IApplicationModel>('application')
}

export class ApplicationPostController extends Controller {
    static async application(applicationData: IApplication) {
        const mongoApp = new models.Application(applicationData);
        return await mongoApp.save();
    }
};