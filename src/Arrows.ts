import View from "./View";
import NineSlicePlane = PIXI.NineSlicePlane;
import Texture = PIXI.Texture;
import Text = PIXI.Text;
import TextStyle = PIXI.TextStyle;

export default class Arrows extends View {
	private _texture:any;
	private _textField:Text;

	constructor(
		private _text:string,
	) {
		super();
		this.h = 9;
	}

	protected init():void {
		super.init();
		this.initTexture();
		this.initTextField();
	}

	private initTexture():void {
		this._texture = new NineSlicePlane(Texture.from("img/arrows.png"), 23, 4, 23, 4);
		this._texture.height = this.h;
		this.addChild(this._texture);
	}

	private initTextField():void {
		const textStyle:TextStyle = new TextStyle();
		textStyle.fontSize = 16;
		textStyle.fontStyle = "bold";
		textStyle.fill = 0x3f48cc;

		this._textField = new Text(this._text, textStyle);
		this._textField.y = -this._textField.height;
		this.addChild(this._textField);
	}

	protected applySize():void {
		super.applySize();
		this.alignTexture();
		this.alignTextField();
	}

	private alignTexture():void {
		this._texture.width = this.w;
	}

	private alignTextField():void {
		this._textField.x = Math.floor((this.w - this._textField.width) / 2);
	}
}