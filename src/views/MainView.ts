import View from "../core/views/View";
import GraphicsView from "../core/views/GraphicsView";
import Button from "./Button";
import InteractiveView from "../core/views/InteractiveView";
import SliderV from "./SliderV";
import SliderH from "./SliderH";

export default class MainView extends View {
	private _background:GraphicsView;
	private _button:Button;
	private _selectableButton:Button;
	private _sliderVertical:SliderV;
	private _sliderHorizontal:SliderH;

	constructor() {
		super();
		this._background = this.addChild(new GraphicsView(0xffffff));
		this._button = this.addChild(new Button("Button"));
		this._selectableButton = this.addChild(new Button("Selectable", true));
		this._sliderVertical = this.addChild(new SliderV());
		this._sliderHorizontal = this.addChild(new SliderH());

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

		const horizontalOffset:number = 400;
		const maxButtonWidth:number = Math.max(this._button.w, this._selectableButton.w);
		const totalWidth:number = maxButtonWidth + horizontalOffset * 2;
		if (totalWidth < this.w) {
			this.centerHorizontal(this._button);
			this.centerHorizontal(this._selectableButton);
		} else {
			this._button.x = Math.floor((totalWidth - this._button.w) / 2);
			this._selectableButton.x = Math.floor((totalWidth - this._selectableButton.w) / 2);
		}

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

		const sliderThickness:number = 20;
		this._sliderVertical.setContentSize(totalHeight);
		this.align(
			this._sliderVertical,
			{
				right: 0,
				w: sliderThickness,
				h: this.h,
			}
		);
		this._sliderHorizontal.setContentSize(totalWidth);
		this.align(
			this._sliderHorizontal,
			{
				bottom: 0,
				w: this.w,
				h: sliderThickness,
			}
		);
	}
}