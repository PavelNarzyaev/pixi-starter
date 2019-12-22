import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import NamedButton from "../core/views/NamedButton";
import CheckBox from "../core/views/CheckBox";

export default class MainView extends View {
	private _background:Graphics;
	private _button:NamedButton;
	private _checkBox:CheckBox;

	constructor() {
		super();
		this.initBackground();
		this.initButton();
		this.initCheckBox();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initButton():void {
		this._button = new NamedButton("Button");
		this._button.setSize(300, 80);
		this.addChild(this._button);
	}

	private initCheckBox():void {
		this._checkBox = new CheckBox();
		this._checkBox.setSize(20, 20);
		this.addChild(this._checkBox);

		this._checkBox.addListener(CheckBox.CHANGE, () => {
			console.log("checkbox checked = " + this._checkBox.getSelected());
		});
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();

		const gap:number = 10;
		const totalHeight:number = this._button.h + gap + this._checkBox.h;
		this._button.y = Math.floor((this.h - totalHeight) / 2);
		this._checkBox.y = this._button.y + this._button.h + gap;
		this.centerHorizontal(this._button);
		this.centerHorizontal(this._checkBox);
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
	}
}