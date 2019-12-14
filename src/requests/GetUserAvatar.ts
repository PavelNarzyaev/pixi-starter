import PixiRequest from "../core/requests/PixiRequest";
import UsersManager from "../managers/UsersManager";

export default class GetUserAvatar extends PixiRequest {
	constructor(
		private _userId:number,
	) {
		super(UsersManager.getAvatarUrl(_userId));
	}
}