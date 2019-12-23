import View from "../core/views/View";
import GraphicsView from "../core/views/GraphicsView";
import Button from "./Button";
import InteractiveView from "../core/views/InteractiveView";
import Slider from "./Slider";

export default class MainView extends View {
	private _background:GraphicsView;
	private _button:Button;
	private _selectableButton:Button;
	private _slider:Slider;

	constructor() {
		super();
		this._background = this.addChild(new GraphicsView(0xffffff));
		this._button = this.addChild(new Button("Button"));
		this._selectableButton = this.addChild(new Button("Selectable", true));
		this._slider = this.addChild(new Slider());

		this._button.addListener(InteractiveView.CLICK, () => { console.log("click"); });
		this._selectableButton.addListener(
			InteractiveView.CHANGE_SELECT,
			() => {
				console.log("selected = " + this._selectableButton.getSelected());
			}
		);
	}

	protected applySize():void {
		super.applySize();

		this._background.setSize(this.w, this.h);
		this._button.setSize(150, 50);
		this._selectableButton.setSize(200, 50);

		const verticalOffset:number = 200;
		const gap:number = 10;
		const buttonsHeight:number = this._button.h + gap + this._selectableButton.h;
		const totalHeight:number = buttonsHeight + verticalOffset * 2;
		if (totalHeight < this.h) {
			this._button.y = Math.floor((this.h - buttonsHeight) / 2);
		} else {
			this._button.y = verticalOffset;
		}
		this._selectableButton.y = this._button.y + this._button.h + gap;
		this.centerHorizontal(this._button);
		this.centerHorizontal(this._selectableButton);

		this._slider.setContentHeight(totalHeight);
		this.align(
			this._slider,
			{
				right: 0,
				w: 20,
				h: this.h,
			}
		);
	}
}