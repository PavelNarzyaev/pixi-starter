import InteractiveView from "./InteractiveView";
import GraphicsView from "./GraphicsView";

export default class ColoredInteractiveView extends InteractiveView {
	private _background:GraphicsView;

	constructor() {
		super();
		this.buttonMode = true;
		this.initBackground();
	}

	private initBackground():void {
		this._background = new GraphicsView();
		this._background.setLineColor(0xbfbfbf);
		this._background.setLineWidth(2);
		this._background.setRoundCorners(20);
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
		this._background.setFillColor(this.getColor());
		this._background.setSize(this.w, this.h);
	}

	protected getColor():number {
		return null;
	}
}