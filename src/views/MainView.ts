import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import GetUserAvatar from "../requests/GetUserAvatar";
import Sprite = PIXI.Sprite;
import UsersManager from "../managers/UsersManager";
import GetUserInfo from "../requests/GetUserInfo";
import {genRandomInteger} from "../Random";

export default class MainView extends View {
	private static readonly MIN_USER_ID:number = 1;
	private static readonly MAX_USER_ID:number = 30;

	private _background:Graphics;
	private _userAvatar:Sprite;

	constructor() {
		super();
		this.init();
	}

	protected init():void {
		this.initBackground();
		this.loadUserAvatar();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private loadUserAvatar():void {
		const userId:number = genRandomInteger(MainView.MIN_USER_ID, MainView.MAX_USER_ID);
		new GetUserInfo(userId).createPromise()
			.then(() => {
				new GetUserAvatar(userId).createPromise()
					.then(() => {
						this._userAvatar = Sprite.from(UsersManager.getAvatarUrl(userId));
						this.addChild(this._userAvatar);
						if (this.w && this.h) {
							this.alignUserAvatar();
						}
					});
			});
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignUserAvatar();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}

	private alignUserAvatar():void {
		if (this._userAvatar) {
			this.center(this._userAvatar);
		}
	}
}