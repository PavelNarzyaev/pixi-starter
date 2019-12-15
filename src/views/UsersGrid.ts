import View from "../core/views/View";
import UserView from "./UserView";
import {genRandomInteger} from "../Random";

export default class UsersGrid extends View {
	private static readonly MIN_USER_ID:number = 1;
	private static readonly MAX_USER_ID:number = 20;
	private static readonly COLUMNS_NUM:number = 2;
	private static readonly ROWS_NUM:number = 2;
	private static readonly GAP:number = 10;
	private static readonly USER_WIDTH_AND_GAP:number = UserView.WIDTH + UsersGrid.GAP;
	private static readonly USER_HEIGHT_AND_GAP:number = UserView.HEIGHT + UsersGrid.GAP;

	private _users:UserView[] = [];

	constructor() {
		super();
		this.init();
		this.setSize(
			UsersGrid.COLUMNS_NUM * UsersGrid.USER_WIDTH_AND_GAP - UsersGrid.GAP,
			UsersGrid.ROWS_NUM * UsersGrid.USER_HEIGHT_AND_GAP - UsersGrid.GAP,
		);
	}

	private init():void {
		this.initUsers();
	}

	private initUsers():void {
		const ids:number[] = [];
		const usersNum:number = UsersGrid.COLUMNS_NUM * UsersGrid.ROWS_NUM;
		while (ids.length < usersNum) {
			const id:number = genRandomInteger(UsersGrid.MIN_USER_ID, UsersGrid.MAX_USER_ID);
			if (ids.indexOf(id) === -1) {
				ids.push(id);
				const user:UserView = new UserView(id);
				user.setSize(UserView.WIDTH, UserView.HEIGHT);
				this.addChild(user);
				this._users.push(user);
			}
		}
	}

	public refresh():void {
		this._users.forEach((user:UserView) => {
			user.parent.removeChild(user);
			// user.destroy();
		});
		this._users.length = 0;
		this.initUsers();
		if (this.w && this.h) {
			this.alignUsers();
		}
	}

	protected applySize():void {
		super.applySize();
		this.alignUsers();
	}

	private alignUsers():void {
		let column:number = 0;
		let row:number = 0;
		let nextX:number = 0;
		let nextY:number = 0;
		this._users.forEach((user:UserView) => {
			user.x = nextX;
			user.y = nextY;
			column++;
			if (column == UsersGrid.COLUMNS_NUM) {
				column = 0;
				nextX = 0;
				row++;
				nextY += UsersGrid.USER_HEIGHT_AND_GAP;
			} else {
				nextX += UsersGrid.USER_WIDTH_AND_GAP;
			}
		});
	}
}