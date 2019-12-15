import PixiRequest from "../core/requests/PixiRequest";
import UsersManager from "../managers/UsersManager";

export default class GetUserAvatar extends PixiRequest {
	constructor(
		private _id:number,
	) {
		super();
	}

	protected createUrl():string {
		return UsersManager.getAvatarUrl(this._id);
	}
}