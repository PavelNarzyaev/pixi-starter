import Text = PIXI.Text;
import View from "./View";

export default class MainContainer extends View {
	private _textField:Text;
	private _topLeft:View;
	private _topRight:View;
	private _bottomLeft:View;
	private _bottomRight:View;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.initTextField();
		this.initCorners();
	}

	private initTextField():void {
		this._textField = new Text("Hello!");
		this.addChild(this._textField);
	}

	private initCorners():void {
		this._topLeft = this.initCorner();
		this._topRight = this.initCorner();
		this._bottomLeft = this.initCorner();
		this._bottomRight = this.initCorner();
	}

	private initCorner():View {
		const corner:View = new View();
		corner.showTestBackground(0xff0000, 1);
		corner.setSize(60, 60);
		this.addChild(corner);
		return corner;
	}

	protected applySize():void {
		super.applySize();
		this.alignTextField();
		this.alignCorners();
	}

	private alignTextField():void {
		this._textField.x = (this.w - this._textField.width) / 2;
		this._textField.y = (this.h - this._textField.height) / 2;
	}

	private alignCorners():void {
		this._topRight.x = this.w - this._topRight.w;
		this._bottomLeft.y = this.h - this._bottomLeft.h;
		this._bottomRight.x = this.w - this._bottomRight.w;
		this._bottomRight.y = this.h - this._bottomRight.h;
	}
}