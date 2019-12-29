import View from "../core/views/View";
import Button from "./Button";
import InteractiveView from "../core/views/InteractiveView";
import Info from "./Info";

export default class MainContent extends View {
	private _button:Button;
	private _selectableButton:Button;
	private _info:Info;
	private _elements:View[] = [];

	private _clicksCounter:number = 0;

	constructor() {
		super();

		this._button = this.initElement(new Button("Button"));
		this._selectableButton = this.initElement(new Button("Selectable", true));
		this._info = this.initElement(new Info());
		this.refreshClicks();
		this.refreshSelected();
		this._button.addListener(
			InteractiveView.CLICK,
			() => {
				this._clicksCounter++;
				this.refreshClicks();
			}
		);
		this._selectableButton.addListener(
			InteractiveView.CHANGE_SELECT,
			() => {
				this.refreshSelected();
			}
		);
	}

	private refreshClicks():void {
		this._info.setClicks(this._clicksCounter);
	}

	private refreshSelected():void {
		this._info.setSelected(this._selectableButton.getSelected());
	}

	private initElement<T extends View>(element:T):T {
		this._elements.push(element);
		return this.addChild(element);
	}

	protected applySize():void {
		super.applySize();

		this._button.setSize(150, 50);
		this._selectableButton.setSize(200, 50);
		this._info.setSize(400, 200);

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