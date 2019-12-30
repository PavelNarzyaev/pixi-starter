import View from "../core/views/View";
import Button from "./Button";
import InteractiveView from "../core/views/InteractiveView";

export default class RadioButtons extends View {
	public static readonly CHANGE:symbol = Symbol();

	private static BUTTON_WIDTH:number = 125;
	private static BUTTON_HEIGHT:number = 50;
	private _buttons:Button[] = [];
	private _index:number;

	constructor(names:string[]) {
		super();
		names.forEach((name:string, i:number) => {
			const newButton:Button = new Button(name, true, false);
			newButton.addListener(InteractiveView.CLICK, () => { this.select(i); }, this);
			this._buttons.push(this.addChild(newButton));
		});
	}

	public select(index:number):void {
		if (this._index !== index) {
			if (this._index !== undefined) {
				this._buttons[this._index].setSelected(false);
				this._buttons[this._index].refresh();
			}
			this._index = index;
			this._buttons[this._index].setSelected(true);
			this._buttons[this._index].refresh();
			this.emit(RadioButtons.CHANGE);
		}
	}

	public getSelectedIndex():number {
		return this._index;
	}

	protected applySize():void {
		super.applySize();
		const freeSpace:number = this.w - RadioButtons.BUTTON_WIDTH * this._buttons.length;
		const gapsNum:number = this._buttons.length - 1;
		const gap:number = Math.floor(freeSpace / gapsNum);
		const buttonY:number = Math.floor((this.h - RadioButtons.BUTTON_HEIGHT) / 2);
		let nextX:number = 0;
		this._buttons.forEach((button:Button) => {
			button.setSize(RadioButtons.BUTTON_WIDTH, RadioButtons.BUTTON_HEIGHT);
			button.x = nextX;
			button.y = buttonY;
			nextX += button.w + gap;
		});
	}
}