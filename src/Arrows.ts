import View from "./View";
import NineSlicePlane = PIXI.NineSlicePlane;
import Texture = PIXI.Texture;
import Text = PIXI.Text;
import TextStyle = PIXI.TextStyle;

export default class Arrows extends View {
	public static readonly HEIGHT:number = 9;

	private _texture:NineSlicePlane;
	private _textField:Text;

	constructor() {
		super();
		this.h = Arrows.HEIGHT;
	}

	protected init():void {
		super.init();
		this.initTexture();
	}

	private initTexture():void {
		this._texture = new NineSlicePlane(Texture.from("img/arrows.png"), 23, 4, 23, 4);
		this._texture.height = this.h;
		this.addChild(this._texture);
	}

	public setText(text:string):void {
		if (!this._textField) {
			const textStyle:TextStyle = new TextStyle();
			textStyle.fontSize = 16;
			textStyle.fontStyle = "bold";
			textStyle.fill = 0x3f48cc;

			this._textField = new Text(text, textStyle);
			this._textField.y = -this._textField.height;
			this.addChild(this._textField);
		} else {
			this._textField.text = text;
		}

		if (this.w) {
			this.alignTextField();
		}
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
		if (this._textField) {
			this._textField.x = Math.floor((this.w - this._textField.width) / 2);
		}
	}
}