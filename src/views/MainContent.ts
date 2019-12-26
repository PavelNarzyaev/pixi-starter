import View from "../core/views/View";
import Button from "./Button";
import InteractiveView from "../core/views/InteractiveView";

export default class MainContent extends View {
	private _button:Button;
	private _selectableButton:Button;
	private _elements:View[] = [];

	constructor() {
		super();

		this._button = this.initElement(new Button("Button"));
		this._selectableButton = this.initElement(new Button("Selectable", true));

		this._button.addListener(InteractiveView.CLICK, () => { console.log("click"); });
		this._selectableButton.addListener(
			InteractiveView.CHANGE_SELECT,
			() => {
				console.log("selected = " + this._selectableButton.getSelected());
			}
		);
	}

	private initElement<T extends View>(element:T):T {
		this._elements.push(element);
		return this.addChild(element);
	}

	protected applySize():void {
		super.applySize();

		this._button.setSize(150, 50);
		this._selectableButton.setSize(200, 50);

		const gap:number = 10;
		let elementsHeight:number = 0;
		this._elements.forEach((element:View) => {
			if (elementsHeight) {
				elementsHeight += gap;
			}
			elementsHeight += element.h;
		});
		let nextY:number = Math.floor((this.h - elementsHeight) / 2);
		this._elements.forEach((element:View) => {
			this.centerHorizontal(element);
			element.y = nextY;
			nextY += element.h + gap;
		});
	}
}