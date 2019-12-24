import SliderAbstract from "./SliderAbstract";
import IPoint = PIXI.IPoint;

export default class SliderAbstractH extends SliderAbstract {
	protected getPointPosition(point:IPoint):number {
		return point.x;
	}

	protected calculateMaxThumbPosition():number {
		return this.w - this._thumb.w;
	}

	protected getThumbPosition():number {
		return this._thumb.x;
	}

	protected setThumbPosition(value:number):void {
		this._thumb.x = value;
	}

	protected getSliderSize():number {
		return this.w;
	}

	public alignThumb():void {
		this._thumb.setSize(this.calculateThumbSize(), this.h);
	}
}