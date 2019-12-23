import View from "./View";
import Graphics = PIXI.Graphics;

export default class GraphicsView extends View {
	private _background:Graphics;
	private _fillColor:number;
	private _fillAlpha:number;
	private _lineWidth:number;
	private _lineColor:number;
	private _roundCorners:number;
	private _dirty:boolean = false;

	constructor(fillColor?:number, fillAlpha?:number, lineWidth?:number, lineColor?:number, roundCorners?:number) {
		super();
		this._fillColor = fillColor !== undefined ? fillColor : 0;
		this._fillAlpha = fillAlpha !== undefined ? fillAlpha : 1;
		this._lineWidth = lineWidth !== undefined ? lineWidth : 0;
		this._lineColor = lineColor !== undefined ? lineColor : 0;
		this._roundCorners = roundCorners !== undefined ? roundCorners : 0;
		this._background = this.addChild(new Graphics());
	}

	public setFillColor(value:number):void {
		this._fillColor = value;
		this.markAsDirty();
	}

	public setFillAlpha(value:number):void {
		this._fillAlpha = value;
		this.markAsDirty();
	}

	public setLineWidth(value:number):void {
		this._lineWidth = value;
		this.markAsDirty();
	}

	public setLineColor(value:number):void {
		this._lineColor = value;
		this.markAsDirty();
	}

	public setRoundCorners(value:number):void {
		this._roundCorners = value;
		this.markAsDirty();
	}

	protected applySize():void {
		super.applySize();
		this.markAsDirty();
	}

	private markAsDirty():void {
		if (!this._dirty) {
			this._dirty = true;
			requestAnimationFrame(() => {
				this.redrawBackground();
				this._dirty = false;
			});
		}
	}

	private redrawBackground():void {
		this._background.clear();
		if (this._lineWidth) {
			this._background.lineStyle(this._lineWidth, this._lineColor);
		}
		this._background.beginFill(this._fillColor);
		if (this._roundCorners) {
			this._background.drawRoundedRect(0, 0, this.w, this.h, this._roundCorners);
		} else {
			this._background.drawRect(0, 0, this.w, this.h);
		}
	}
}