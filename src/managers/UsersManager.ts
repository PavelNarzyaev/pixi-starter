import IUser from "../interfaces/IUser";

export default class UsersManager {
	private static _userById:Map<number, IUser> = new Map<number, IUser>();

	public static addUser(user:IUser):void {
		this._userById.set(user.id, user);
	}

	public static getUer(id:number):IUser {
		return this._userById.get(id);
	}

	public static getUserUrl(id:number):string {
		return "/json/users/" + id + ".json";
	}

	public static getAvatarUrl(id:number):string {
		return "/img/avatars/" + UsersManager.getUer(id).avatar;
	}
}