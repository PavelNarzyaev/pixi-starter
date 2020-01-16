import InteractiveView from "../InteractiveView";
import OneLineTextField from "../OneLineTextField";
import TextStyle = PIXI.TextStyle;
import ButtonTexture from "./ButtonTexture";

export default class Button extends InteractiveView {
	private _texture:ButtonTexture;
	private _nameField:OneLineTextField;

	constructor(
		private _name:string,
		selectable:boolean = false,
		selected:boolean = false,
	) {
		super(selectable, selected);
		this.buttonMode = true;
		this._texture = this.addChild(new ButtonTexture(selectable));
		this._nameField = this.addChild(
			new OneLineTextField(
				this._name,
				new TextStyle({
					fill: 0x16533a,
					dropShadow: true,
					dropShadowColor: 0xffffff,
					dropShadowAngle: Math.PI / 2,
					dropShadowAlpha: .2,
					dropShadowDistance: 1,
				})
			)
		);
		this.refreshState();
	}

	protected refreshState():void {
		super.refreshState();
		this._texture.refreshTexture(this.getCurrentState(), this.getSelected());
	}

	protected applySize():void {
		super.applySize();
		this.refreshTexture();
		this._nameField.setSize(this.w * .8, this.h * .6);
		this.center(this._nameField);
	}

	private refreshTexture():void {
		this._texture.setSize(this.w, this.h);
	}
}