import ColoredInteractiveView from "./ColoredInteractiveView";
import InteractiveView from "./InteractiveView";
import OneLineTextField from "./OneLineTextField";

export default class NamedButton extends ColoredInteractiveView {
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
		switch (this.getCurrentState()) {
			case InteractiveView.OVER_STATE:
				return 0xf2f2f2;

			case InteractiveView.DEFAULT_STATE:
				return 0xe6e6e6;

			case InteractiveView.PRESSED_STATE:
				return 0xd9d9d9;

			default:
				return 0;
		}
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