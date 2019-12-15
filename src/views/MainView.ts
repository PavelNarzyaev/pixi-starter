import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import UsersGrid from "./UsersGrid";
import Button from "./Button";

export default class MainView extends View {
	private static GAP:number = 20;

	private _background:Graphics;
	private _usersGrid:UsersGrid;
	private _refreshButton:Button;

	constructor() {
		super();
		this.init();
	}

	protected init():void {
		this.initBackground();
		this.initUsersGrid();
		this.initRefreshButton();
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

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignRefreshButton();
		this.alignUsersGrid();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}

	private alignRefreshButton():void {
		this.centerX(this._refreshButton);
		this._refreshButton.y = Math.floor((this.h - (this._usersGrid.h + this._refreshButton.h + MainView.GAP)) / 2);
	}

	private alignUsersGrid():void {
		this.centerX(this._usersGrid);
		this._usersGrid.y = this._refreshButton.y + this._refreshButton.h + MainView.GAP;
	}
}