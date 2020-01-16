import InteractiveView from "../InteractiveView";
import GraphicsView from "../GraphicsView";

export default class Thumb extends InteractiveView {
	private _skin:GraphicsView;

	constructor() {
		super();
		this._skin = this.addChild(new GraphicsView());
		this._skin.roundCorners = 6;
		this._skin.lineWidth = 2;
		this._skin.lineColor = 0x282828;
		this.refreshState();
	}

	protected refreshState():void {
		super.refreshState();
		switch (this.getCurrentState()) {
			case InteractiveView.OVER_STATE:
				this._skin.fillColor = 0x808080;
				break;

			case InteractiveView.DEFAULT_STATE:
				this._skin.fillColor = 0x666666;
				break;

			case InteractiveView.PRESSED_STATE:
				this._skin.fillColor = 0x4C4C4C;
				break;
		}
		this._skin.redraw();
	}

	protected applySize():void {
		super.applySize();
		this._skin.setSize(this.w, this.h);
	}
}