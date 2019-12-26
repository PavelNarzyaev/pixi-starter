import Text = PIXI.Text;
import View from "./View";
import TextStyle = PIXI.TextStyle;

export default class OneLineTextField extends View {
	private _field:Text;
	private _text:string = "";
	private _style:TextStyle;

	constructor(text?:string, style?:TextStyle) {
		super();
		if (text) {
			this.setText(text);
		}
		if (style) {
			this.setStyle(style);
		}
		if (text) {
			this.refresh();
		}
	}

	public setStyle(value:TextStyle, applyImmediately:boolean = false):void {
		this._style = value;
		if (applyImmediately) {
			this.refresh();
		}
	}

	public setText(value:string, applyImmediately:boolean = false):void {
		if (this._text !== value) {
			this._text = value;
			if (applyImmediately) {
				this.refresh();
			}
		}
	}

	public refresh():void {
		if (!this._field) {
			this._field = this.addChild(new Text(this._text, this._style));
		} else {
			this._field.text = this._text;
			this._field.style = this._style;
		}
		if (this.w && this.h) {
			this.alignField();
		}
	}

	protected applySize() {
		super.applySize();
		this.alignField();
	}

	private alignField():void {
		if (this._field) {
			const fontSize:number = Math.floor(this.h * .9);
			if (fontSize > 0) {
				this._field.visible = true;
				this._field.style.fontSize = fontSize;
				this._field.text = this._text;
				while (this._field.width > this.w && this._field.text.length >= 4) {
					this._field.text = this._field.text.substring(0, this._field.text.length - 4) + "...";
				}
				this.center(this._field);
			} else {
				this._field.visible = false;
			}
		}
	}
}