import View from "../core/views/View";
import NamedButton from "../core/views/NamedButton";
import CheckBox from "../core/views/CheckBox";
import GraphicsView from "../core/views/GraphicsView";

export default class MainView extends View {
	private _background:GraphicsView;
	private _button:NamedButton;
	private _checkBox:CheckBox;

	protected init():void {
		super.init();
		this._background = this.addChild(new GraphicsView(0xffffff));
		this._button = this.addChild(new NamedButton("Button"));
		this._checkBox = this.addChild(new CheckBox());
		this._checkBox.addListener(CheckBox.CHANGE, () => {
			console.log("checkbox checked = " + this._checkBox.getSelected());
		});
	}

	protected applySize():void {
		super.applySize();

		this._background.setSize(this.w, this.h);
		this._button.setSize(300, 80);
		this._checkBox.setSize(20, 20);

		const gap:number = 10;
		const totalHeight:number = this._button.h + gap + this._checkBox.h;
		this._button.y = Math.floor((this.h - totalHeight) / 2);
		this._checkBox.y = this._button.y + this._button.h + gap;
		this.centerHorizontal(this._button);
		this.centerHorizontal(this._checkBox);
	}
}