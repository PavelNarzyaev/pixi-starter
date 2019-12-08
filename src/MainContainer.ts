import * as PIXI from "pixi.js";

export default class MainContainer extends PIXI.Container {
	public static readonly WIDTH:number = 700;
	public static readonly HEIGHT:number = 350;

	private _background:PIXI.Graphics;
	private _textField:PIXI.Text;

	constructor() {
		super();
		this.init();
	}

	private init():void {
		this.initBackground();
		this.initTextField();
	}

	private initBackground():void {
		this._background = new PIXI.Graphics();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, MainContainer.WIDTH, MainContainer.HEIGHT);
		this._background.endFill();
		this.addChild(this._background);
	}

	private initTextField():void {
		this._textField = new PIXI.Text("Hello!");
		this._textField.x = (MainContainer.WIDTH - this._textField.width) / 2;
		this._textField.y = (MainContainer.HEIGHT - this._textField.height) / 2;
		this.addChild(this._textField);
	}
}