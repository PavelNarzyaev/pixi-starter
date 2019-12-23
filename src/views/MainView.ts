import View from "../core/views/View";
import GraphicsView from "../core/views/GraphicsView";
import Button from "./Button";
import InteractiveView from "../core/views/InteractiveView";
import SelectableView from "../core/views/SelectableView";

export default class MainView extends View {
	private _background:GraphicsView;
	private _button:Button;
	private _selectableButton:Button;

	constructor() {
		super();
		this._background = this.addChild(new GraphicsView(0xffffff));
		this._button = this.addChild(new Button("Button"));
		this._selectableButton = this.addChild(new Button("Selectable", true));

		this._button.addListener(InteractiveView.CLICK, () => { console.log("click"); });
		this._selectableButton.addListener(
			SelectableView.CHANGE,
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

		const gap:number = 10;
		const totalHeight:number = this._button.h + gap + this._selectableButton.h;
		this._button.y = Math.floor((this.h - totalHeight) / 2);
		this._selectableButton.y = this._button.y + this._button.h + gap;
		this.centerHorizontal(this._button);
		this.centerHorizontal(this._selectableButton);
	}
}