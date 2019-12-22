import InteractiveView from "./InteractiveView";
import GraphicsView from "./GraphicsView";

export default class ColoredInteractiveView extends InteractiveView {
	private _background:GraphicsView;

	protected init():void {
		super.init();

		this.buttonMode = true;

		this._background = this.addChild(new GraphicsView());
		this._background.setLineColor(0xbfbfbf);
		this._background.setLineWidth(2);
		this._background.setRoundCorners(20);
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
		this._background.setFillColor(this.getColor());
		this._background.setSize(this.w, this.h);
	}

	protected getColor():number {
		return null;
	}
}