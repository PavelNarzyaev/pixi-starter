import InteractiveView from "../core/views/InteractiveView";
import Graphics = PIXI.Graphics;

export default class TestInteractiveView extends InteractiveView {
	private _background:Graphics;

	constructor() {
		super();
		this.initBackground();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.lineStyle(2, 0xcdcdcd);
		this._background.beginFill(0xededed);
		this._background.drawRect(0, 0, this.w, this.h);
	}
}