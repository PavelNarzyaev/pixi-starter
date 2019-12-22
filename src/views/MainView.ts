import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import ColoredInteractiveView from "../core/views/ColoredInteractiveView";

export default class MainView extends View {
	private _background:Graphics;
	private _button:ColoredInteractiveView;

	constructor() {
		super();
		this.initBackground();
		this.initButton();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initButton():void {
		this._button = new ColoredInteractiveView();
		this._button.setSize(100, 100);
		this.addChild(this._button);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignButton();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
	}

	private alignButton():void {
		this.center(this._button);
	}
}