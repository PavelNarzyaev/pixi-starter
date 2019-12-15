import XhrRequest from "../core/requests/XhrRequest";
import IUser from "../interfaces/IUser";
import UsersManager from "../managers/UsersManager";

export default class GetUserInfo extends XhrRequest {
	constructor(
		private _id:number,
	) {
		super();
	}

	protected createRequestId():string {
		return "GetUserInfo:" + this._id;
	}

	protected createUrl():string {
		return UsersManager.getUserUrl(this._id);
	}

	protected parseRequest(user:IUser):void {
		super.parseRequest(user);
		UsersManager.addUser(user);
	}
}