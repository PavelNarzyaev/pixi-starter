import InteractiveView from "./InteractiveView";
import GraphicsView from "./GraphicsView";

export default class ColoredInteractiveView extends InteractiveView {
	private _background:GraphicsView;

	constructor() {
		super();
		this.buttonMode = true;
		this._background = this.addChild(new GraphicsView());
		this._background.lineColor = 0xbfbfbf;
		this._background.lineWidth = 2;
		this._background.roundCorners = 20;
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
		this._background.fillColor = this.getColor();
		this._background.w = this.w;
		this._background.h = this.h;
		this._background.redraw();
	}

	protected getColor():number {
		return null;
	}
}