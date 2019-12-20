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

	protected refreshState(state:symbol):void {
		super.refreshState(state);
		switch (state) {
			case InteractiveView.DEFAULT_STATE:
				console.log("default state");
				break;

			case TestInteractiveView.OVER_STATE:
				console.log("over state");
				break;

			case TestInteractiveView.PRESSED_STATE:
				console.log("pressed state");
				break;
		}
	}
}