import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import UsersGrid from "./UsersGrid";
import Button from "./Button";
import Info from "./Info";

export default class MainView extends View {
	private static GAP:number = 20;

	private _background:Graphics;
	private _usersGrid:UsersGrid;
	private _refreshButton:Button;
	private _info:Info;

	constructor() {
		super();
		this.init();
	}

	protected init():void {
		this.initBackground();
		this.initUsersGrid();
		this.initRefreshButton();
		this.initInfo();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initUsersGrid():void {
		this._usersGrid = new UsersGrid();
		this.addChild(this._usersGrid);
	}

	private initRefreshButton():void {
		this._refreshButton = new Button("Refresh", () => { this._usersGrid.refresh(); });
		this._refreshButton.setSize(100, 50);
		this.addChild(this._refreshButton);
	}

	private initInfo():void {
		this._info = new Info();
		this._info.setSize(250, 530);
		this.addChild(this._info);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignHorizontal();
		this.alignVertical();
	}

	private alignHorizontal():void {
		this._usersGrid.x = Math.floor((this.w - (this._usersGrid.w + this._info.w + MainView.GAP)) / 2);
		this._refreshButton.x = this._usersGrid.x + Math.floor((this._usersGrid.w - this._refreshButton.w) / 2);
		this._info.x = this._usersGrid.x + this._usersGrid.w + MainView.GAP;
	}

	private alignVertical():void {
		this._refreshButton.y = Math.floor((this.h - (this._usersGrid.h + this._refreshButton.h + MainView.GAP)) / 2);
		this._usersGrid.y = this._refreshButton.y + this._refreshButton.h + MainView.GAP;
		this.centerY(this._info);
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}
}