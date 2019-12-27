import View from "../../View";
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "../../../../PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import IPoint = PIXI.IPoint;
import InteractiveView from "../../InteractiveView";

export default class SliderAbstract extends View {
	public static readonly CHANGE_PERCENT:symbol = Symbol();
	protected _thumb:InteractiveView;
	private _thumbSizePercent:number;
	private _background:View;
	private _thumbPointerDownPosition:number;
	private _percent:number = 0;
	private _thumbPositionInvalidated:boolean = false;
	private _thumbSizeInvalidated:boolean = false;

	constructor() {
		super();
		this._background = this.addChild(this.backgroundFactory());
		this._background.interactive = true;
		this._background.on(POINTER_DOWN, this.backgroundPointerDownHandler, this);
		this._thumb = this.addChild(this.thumbFactory());
		this._thumb.on(POINTER_DOWN, this.thumbPointerDownHandler, this);
		this.interactive = true;
		this.on(POINTER_UP, this.pointerUpHandler, this);
		this.on(POINTER_UP_OUTSIDE, this.pointerUpHandler, this);
	}

	private backgroundPointerDownHandler(event:InteractionEvent):void {
		const pointerDownPosition:number = this.getPointPosition(this.toLocal(event.data.global));
		this.moveThumbToPosition(pointerDownPosition - this.getThumbSize() / 2);
		this.pressThumb(event);
	}

	private thumbPointerDownHandler(event:InteractionEvent):void {
		this.pressThumb(event);
	}

	private pressThumb(event:InteractionEvent):void {
		this._thumbPointerDownPosition = this.getPointPosition(this._thumb.toLocal(event.data.global));
		this._thumb.press();
		this._thumb.on(POINTER_MOVE, this.pointerMoveHandler, this);
	}

	private pointerUpHandler():void {
		this.releaseThumb();
	}

	private releaseThumb():void {
		this._thumb.release();
		this._thumb.off(POINTER_MOVE, this.pointerMoveHandler, this);
	}

	private pointerMoveHandler(event:InteractionEvent):void {
		const eventPosition:number = this.getPointPosition(this.toLocal(event.data.global));
		this.moveThumbToPosition(eventPosition - this._thumbPointerDownPosition);
	}

	private moveThumbToPosition(targetPosition:number):void {
		const maxPosition:number = this.calculateMaxThumbPosition();
		const correctedPosition:number = Math.floor(Math.max(0, Math.min(maxPosition, targetPosition)));
		if (this.getThumbPosition() !== correctedPosition) {
			this._percent = correctedPosition / maxPosition;
			this._thumbPositionInvalidated = true;
			this.validateThumbPosition();
			this.emit(SliderAbstract.CHANGE_PERCENT, this);
		}
	}

	protected applySize():void {
		super.applySize();
		if (this.visible) {
			this._background.setSize(this.w, this.h);
			this._thumbSizeInvalidated = true;
			this._thumbPositionInvalidated = true;
			this.validate();
		}
	}

	public validate():void {
		this.validateThumbSize();
		this.validateThumbPosition();
	}

	private validateThumbSize():void {
		if (this._thumbSizeInvalidated) {
			this.refreshThumbSize();
			this._thumbSizeInvalidated = false;
		}
	}

	private validateThumbPosition():void {
		if (this._thumbPositionInvalidated) {
			this.setThumbPosition(Math.floor(this.calculateMaxThumbPosition() * this._percent));
			this._thumbPositionInvalidated = false;
		}
	}

	public setPercent(value:number) {
		if (this._percent !== value) {
			this._percent = Math.min(1, Math.max(0, value));
			this._thumbPositionInvalidated = true;
		}
	}

	public getPercent():number {
		return this._percent;
	}

	public setThumbPercentSize(value:number):void {
		this._thumbSizePercent = value;
		this._thumbSizeInvalidated = true;
		this._thumbPositionInvalidated = true;
	}

	protected calculateThumbSize():number {
		const minSize:number = Math.min(30, this.getSliderSize() * 0.5);
		return Math.max(minSize, this._thumbSizePercent * this.getSliderSize());
	}

	//////////////////////////////////
	// override methods (direction) //
	//////////////////////////////////

	protected getPointPosition(point:IPoint):number {
		return null;
	}

	protected calculateMaxThumbPosition():number {
		return null;
	}

	protected getThumbPosition():number {
		return null;
	}

	protected setThumbPosition(value:number):void {
	}

	protected getSliderSize():number {
		return null;
	}

	protected getThumbSize():number {
		return  null;
	}

	protected refreshThumbSize():void {
	}

	//////////////////////////////
	// override methods (skins) //
	//////////////////////////////

	protected backgroundFactory():View {
		return null;
	}

	protected thumbFactory():InteractiveView {
		return null;
	}
}