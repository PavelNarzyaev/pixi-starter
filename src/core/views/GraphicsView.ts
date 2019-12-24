import View from "./View";
import Graphics = PIXI.Graphics;

export default class GraphicsView extends View {
	public fillColor:number;
	public fillAlpha:number;
	public lineWidth:number;
	public lineColor:number;
	public roundCorners:number;
	private _background:Graphics;

	constructor(fillColor?:number, fillAlpha?:number, lineWidth?:number, lineColor?:number, roundCorners?:number) {
		super();
		this.fillColor = fillColor !== undefined ? fillColor : 0;
		this.fillAlpha = fillAlpha !== undefined ? fillAlpha : 1;
		this.lineWidth = lineWidth !== undefined ? lineWidth : 0;
		this.lineColor = lineColor !== undefined ? lineColor : 0;
		this.roundCorners = roundCorners !== undefined ? roundCorners : 0;
		this._background = this.addChild(new Graphics());
	}

	protected applySize():void {
		super.applySize();
		this._background.clear();
		if (this.lineWidth) {
			this._background.lineStyle(this.lineWidth, this.lineColor, 1, 0);
		}
		this._background.beginFill(this.fillColor);
		if (this.roundCorners) {
			this._background.drawRoundedRect(0, 0, this.w, this.h, this.roundCorners);
		} else {
			this._background.drawRect(0, 0, this.w, this.h);
		}
	}

	public redraw():void {
		this.applySize();
	}
}