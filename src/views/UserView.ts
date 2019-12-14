import View from "../core/views/View";
import Sprite = PIXI.Sprite;
import GetUserInfo from "../requests/GetUserInfo";
import GetUserAvatar from "../requests/GetUserAvatar";
import UsersManager from "../managers/UsersManager";
import Text = PIXI.Text;
import Graphics = PIXI.Graphics;

export default class UserView extends View {
	public static readonly WIDTH:number = 140;
	public static readonly HEIGHT:number = 200;

	private _background:Graphics;
	private _avatar:Sprite;
	private _nameField:Text;

	constructor(
		private _id:number,
	) {
		super();
		this.init();
	}

	private init():void {
		this.preload();
		this.initBackground();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private preload():void {
		new GetUserInfo(this._id).createPromise()
			.then(() => {
				this.initNameField();
				new GetUserAvatar(this._id).createPromise()
					.then(() => {
						this.initAvatar();
					});
			});
	}

	private initNameField():void {
		this._nameField = new Text(
			UsersManager.getUer(this._id).name,
			{
				fontSize:14,
				fontStyle:"bold",
			}
		);
		this.addChild(this._nameField);
		this._nameField.y = 110;
		if (this.w && this.h) {
			this.alignNameField();
		}
	}

	private initAvatar():void {
		this._avatar = Sprite.from(UsersManager.getAvatarUrl(this._id));
		this._avatar.y = 30;
		this.addChild(this._avatar);
		if (this.w && this.h) {
			this.alignAvatar();
		}
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignAvatar();
		this.alignNameField();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.lineStyle(2, 0xcdcdcd);
		this._background.beginFill(0xededed);
		this._background.drawRect(0, 0, this.w, this.h);
	}

	private alignAvatar():void {
		if (this._avatar) {
			this.centerX(this._avatar);
		}
	}

	private alignNameField():void {
		if (this._nameField) {
			this.centerX(this._nameField);
		}
	}
}