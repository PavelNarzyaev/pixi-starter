import InteractiveView from "./InteractiveView";
import Graphics = PIXI.Graphics;

export default class ColoredInteractiveView extends InteractiveView {
	private _background:Graphics;

	constructor() {
		super();
		this.buttonMode = true;
		this.initBackground();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	protected refreshState():void {
		super.refreshState();
		this.redrawBackground();
	}

	protected applySize():void {
		super.applySize();
		this.redrawBackground();
	}

	private redrawBackground():void {
		this._background.clear();
		this._background.lineStyle(2, 0xbfbfbf);
		this._background.beginFill(this.getColor());
		this._background.drawRoundedRect(0, 0, this.w, this.h, 20);
	}

	protected getColor():number {
		return null;
	}
}