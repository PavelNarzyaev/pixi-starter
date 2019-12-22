import InteractiveView from "./InteractiveView";
import Graphics = PIXI.Graphics;

export default class ColoredInteractiveView extends InteractiveView {
	private static _colorByState:Map<symbol, number>;
	private _background:Graphics;

	constructor() {
		super();
		if (!ColoredInteractiveView._colorByState) {
			ColoredInteractiveView._colorByState = new Map<symbol, number>();
			ColoredInteractiveView._colorByState.set(InteractiveView.OVER_STATE, 0xf2f2f2);
			ColoredInteractiveView._colorByState.set(InteractiveView.DEFAULT_STATE, 0xe6e6e6);
			ColoredInteractiveView._colorByState.set(InteractiveView.PRESSED_STATE, 0xd9d9d9);
		}
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
		this._background.beginFill(ColoredInteractiveView._colorByState.get(this.getState()));
		this._background.drawRoundedRect(0, 0, this.w, this.h, 20);
	}
}