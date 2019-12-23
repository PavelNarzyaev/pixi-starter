import Text = PIXI.Text;
import View from "./View";

export default class OneLineTextField extends View {
	private _field:Text;

	constructor(
		private _text:string,
	) {
		super();
		this._field = this.addChild(new Text(this._text));
	}

	protected applySize() {
		super.applySize();
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