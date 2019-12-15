import ITeam from "../interfaces/ITeam";

export default class TeamsManager {
	private static _teamById:Map<number, ITeam> = new Map<number, ITeam>();

	public static addTeam(team:ITeam):void {
		this._teamById.set(team.id, team);
	}

	public static getTeam(id:number):ITeam {
		return this._teamById.get(id);
	}

	public static getTeamUrl(id:number):string {
		return "json/teams/" + id + ".json";
	}

	public static getImageUrl(id:number):string {
		return "img/teams/" + TeamsManager.getTeam(id).image;
	}
}