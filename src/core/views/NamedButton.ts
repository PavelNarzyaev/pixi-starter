import ColoredInteractiveView from "./ColoredInteractiveView";
import InteractiveView from "./InteractiveView";
import OneLineTextField from "./OneLineTextField";

export default class NamedButton extends ColoredInteractiveView {
	private static _colorByState:Map<symbol, number>;
	private _textField:OneLineTextField;

	constructor(
		private _name:string,
	) {
		super();
		this.initTextField();
	}

	private initTextField():void {
		this._textField = new OneLineTextField(this._name);
		this.addChild(this._textField);
	}

	protected getColor():number {
		if (!NamedButton._colorByState) {
			NamedButton._colorByState = new Map<symbol, number>();
			NamedButton._colorByState.set(InteractiveView.OVER_STATE, 0xf2f2f2);
			NamedButton._colorByState.set(InteractiveView.DEFAULT_STATE, 0xe6e6e6);
			NamedButton._colorByState.set(InteractiveView.PRESSED_STATE, 0xd9d9d9);
		}
		return NamedButton._colorByState.get(this.getCurrentState());
	}

	protected applySize():void {
		super.applySize();
		this.alignTextField();
	}

	private alignTextField():void {
		this._textField.setSize("80%", "50%");
		this.center(this._textField);
	}
}