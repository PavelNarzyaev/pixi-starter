import View from "../core/views/View";
import OneLineTextField from "../core/views/OneLineTextField";
import TextStyle = PIXI.TextStyle;
import NineSlicePlane = PIXI.NineSlicePlane;
import Texture = PIXI.Texture;

export default class Info extends View {
	private _border:NineSlicePlane;
	private _clicksLine:NameAndValueLine;
	private _selectedLine:NameAndValueLine;
	private _itemLine:NameAndValueLine;
	private _lines:View[] = [];

	constructor() {
		super();
		this._border = this.addChild(
			new NineSlicePlane(
				Texture.from("img/info_border.png"),
				10,
				10,
				10,
				10
			)
		);
		this._clicksLine = this.initLine(new NameAndValueLine("Clicks:"));
		this._selectedLine = this.initLine(new NameAndValueLine("Selected:"));
		this._itemLine = this.initLine(new NameAndValueLine("Value:"));
	}

	public setClicks(value:number):void {
		this._clicksLine.setValue(value.toString());
	}

	public setSelected(value:boolean):void {
		this._selectedLine.setValue(String(value));
	}

	public setItem(value:string):void {
		this._itemLine.setValue(value);
	}

	private initLine<T extends View>(element:T):T {
		this._lines.push(element);
		return this.addChild(element);
	}

	protected applySize():void {
		super.applySize();
		this._border.width = this.w;
		this._border.height = this.h;
		const elementHeight:number = 40;
		const elementsHeight:number = this._lines.length * elementHeight;
		let nextY:number = Math.floor((this.h - elementsHeight) / 2);
		this._lines.forEach((element:View) => {
			element.setSize(this.w, elementHeight);
			element.y = nextY;
			nextY += element.h;
		});
	}
}

class NameAndValueLine extends View {
	private static _style:TextStyle;

	private _nameField:OneLineTextField;
	private _valueField:OneLineTextField;

	constructor(name:string) {
		super();
		if (!NameAndValueLine._style) {
			NameAndValueLine._style = new TextStyle({
				fill: 0x222222,
				dropShadow: true,
				dropShadowColor: 0xffffff,
				dropShadowAngle: Math.PI / 2,
				dropShadowAlpha: .2,
				dropShadowDistance: 1,
			});
		}

		this._nameField = this.addChild(new OneLineTextField(name, NameAndValueLine._style));
		this._nameField.setAlign(OneLineTextField.ALIGN_RIGHT);
		this._valueField = this.addChild(new OneLineTextField());
		this._valueField.setAlign(OneLineTextField.ALIGN_LEFT);
		this._valueField.setStyle(NameAndValueLine._style);
	}

	public setValue(value:string):void {
		this._valueField.setText(value);
	}

	protected applySize():void {
		super.applySize();
		const gap:number = 10;
		this._nameField.setSize(this.w * .5, this.h);
		this._valueField.setSize(this.w - this._nameField.w - gap, this.h);
		this._valueField.x = this._nameField.w + gap;
	}
}