import View from "../core/views/View";
import OneLineTextField from "../core/views/OneLineTextField";
import TextStyle = PIXI.TextStyle;

export default class Info extends View {
	private _clicksNameField:NameAndValueFields;
	private _selectedNameField:NameAndValueFields;
	private _elements:View[] = [];

	constructor() {
		super();
		this._clicksNameField = this.initElement(new NameAndValueFields("Clicks:"));
		this._selectedNameField = this.initElement(new NameAndValueFields("Selected:"));
	}

	public setClicks(value:number):void {
		this._clicksNameField.setValue(value.toString());
	}

	public setSelected(value:boolean):void {
		this._selectedNameField.setValue(String(value));
	}

	private initElement<T extends View>(element:T):T {
		this._elements.push(element);
		return this.addChild(element);
	}

	protected applySize():void {
		super.applySize();
		const elementHeight:number = 40;
		const elementsHeight:number = this._elements.length * elementHeight;
		let nextY:number = Math.floor((this.h - elementsHeight) / 2);
		this._elements.forEach((element:View) => {
			element.setSize(this.w, elementHeight);
			element.y = nextY;
			nextY += element.h;
		});
	}
}

class NameAndValueFields extends View {
	private static _style:TextStyle;

	private _nameField:OneLineTextField;
	private _valueField:OneLineTextField;

	constructor(name:string) {
		super();
		if (!NameAndValueFields._style) {
			NameAndValueFields._style = new TextStyle({
				fill: 0x222222,
				dropShadow: true,
				dropShadowColor: 0xffffff,
				dropShadowAngle: Math.PI / 2,
				dropShadowAlpha: .2,
				dropShadowDistance: 1,
			});
		}

		this._nameField = this.addChild(new OneLineTextField(name, NameAndValueFields._style));
		this._nameField.setAlign(OneLineTextField.ALIGN_RIGHT);
		this._valueField = this.addChild(new OneLineTextField());
		this._valueField.setAlign(OneLineTextField.ALIGN_LEFT);
		this._valueField.setStyle(NameAndValueFields._style);
	}

	public setValue(value:string):void {
		this._valueField.setText(value, true);
	}

	protected applySize():void {
		super.applySize();
		const gap:number = 10;
		this._nameField.setSize(this.w * .5, this.h);
		this._valueField.setSize(this.w - this._nameField.w - gap, this.h);
		this._valueField.x = this._nameField.w + gap;
	}
}