import PixiRequest from "../core/requests/PixiRequest";
import TeamsManager from "../managers/TeamsManager";

export default class GetTeamImage extends PixiRequest {
	constructor(
		private _id:number,
	) {
		super();
	}

	protected createUrl():string {
		return TeamsManager.getImageUrl(this._id);
	}
}