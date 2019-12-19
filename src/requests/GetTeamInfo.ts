import XhrRequest from "../core/requests/XhrRequest";
import TeamsManager from "../managers/TeamsManager";
import ITeam from "../interfaces/ITeam";

export default class GetTeamInfo extends XhrRequest {
	constructor(
		private _id:number,
	) {
		super();
	}

	protected createRequestId():string {
		return "GetTeamInfo:" + this._id;
	}

	protected createUrl():string {
		return TeamsManager.getTeamUrl(this._id);
	}

	protected parseResponse(team:ITeam):void {
		super.parseResponse(team);
		TeamsManager.addTeam(team);
	}
}