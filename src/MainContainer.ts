import Text = PIXI.Text;
import View from "./View";

export default class MainContainer extends View {
	private _textField:Text;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.initTextField();
	}

	private initTextField():void {
		this._textField = new Text("Hello!");
		this.addChild(this._textField);
	}

	protected applySize():void {
		super.applySize();
		this.alignTextField();
	}

	private alignTextField():void {
		this._textField.x = (this.w - this._textField.width) / 2;
		this._textField.y = (this.h - this._textField.height) / 2;
	}
}