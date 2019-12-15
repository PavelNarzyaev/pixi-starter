import PixiRequest from "../core/requests/PixiRequest";
import TeamsManager from "../managers/TeamsManager";

export default class GetTeamImage extends PixiRequest {
	constructor(
		private _teamId:number,
	) {
		super(TeamsManager.getImageUrl(_teamId));
	}
}