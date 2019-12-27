import SliderAbstract from "./SliderAbstract";
import IPoint = PIXI.IPoint;

export default class SliderAbstractV extends SliderAbstract {
	protected getPointPosition(point:IPoint):number {
		return point.y;
	}

	protected calculateMaxThumbPosition():number {
		return this.h - this._thumb.h;
	}

	protected getThumbPosition():number {
		return this._thumb.y;
	}

	protected setThumbPosition(value:number):void {
		this._thumb.y = value;
	}

	protected getSliderSize():number {
		return this.h;
	}

	protected refreshThumbSize():void {
		this._thumb.setSize(this.w, this.calculateThumbSize());
	}
}