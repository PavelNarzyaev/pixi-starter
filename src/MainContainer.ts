import Graphics = PIXI.Graphics;
import Text = PIXI.Text;
import View from "./View";

export default class MainContainer extends View {
	private _background:Graphics;
	private _textField:Text;

	constructor() {
		super();
	}

	protected onCreate():void {
		super.onCreate();
		this.initBackground();
		this.initTextField();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initTextField():void {
		this._textField = new Text("Hello!");
		this.addChild(this._textField);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignTextField();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}

	private alignTextField():void {
		this._textField.x = Math.floor((this.w - this._textField.width) / 2);
		this._textField.y = Math.floor((this.h - this._textField.height) / 2);
	}
}