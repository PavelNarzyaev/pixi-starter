import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import {genRandomInteger} from "../Random";
import UserView from "./UserView";

export default class MainView extends View {
	private static readonly MIN_USER_ID:number = 1;
	private static readonly MAX_USER_ID:number = 30;
	private static readonly USERS_NUM:number = 5;

	private _background:Graphics;
	private _users:UserView[] = [];

	constructor() {
		super();
		this.init();
	}

	protected init():void {
		this.initBackground();
		this.initUsers();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initUsers():void {
		const ids:number[] = [];
		while (ids.length < MainView.USERS_NUM) {
			const id:number = genRandomInteger(MainView.MIN_USER_ID, MainView.MAX_USER_ID);
			if (ids.indexOf(id) === -1) {
				ids.push(id);
				const user:UserView = new UserView(id);
				user.setSize(UserView.WIDTH, UserView.HEIGHT);
				this.addChild(user);
				this._users.push(user);
			}
		}
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignUsers();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}

	private alignUsers():void {
		const gap:number = 10;
		const usersWidth:number = (UserView.WIDTH + gap) * this._users.length - gap;
		let nextX:number = Math.floor((this.w - usersWidth) / 2);
		this._users.forEach((user:UserView) => {
			user.x = nextX;
			this.centerY(user);
			nextX += UserView.WIDTH + gap;
		});
	}
}