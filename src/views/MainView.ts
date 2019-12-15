import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import UsersGrid from "./UsersGrid";

export default class MainView extends View {
	private _background:Graphics;
	private _usersGrid:UsersGrid;

	constructor() {
		super();
		this.init();
	}

	protected init():void {
		this.initBackground();
		this.initUsersGrid();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initUsersGrid():void {
		this._usersGrid = new UsersGrid();
		this.addChild(this._usersGrid);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignUsersGrid();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}

	private alignUsersGrid():void {
		this.center(this._usersGrid);
	}
}