import View from "../View";
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "../../../PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import IPoint = PIXI.IPoint;
import InteractiveView from "../InteractiveView";

export default class SliderAbstract extends View {
	public static readonly CHANGE_PERCENT:symbol = Symbol();
	protected _thumb:InteractiveView;
	private _background:View;
	private _pointerDownPosition:number;
	private _percent:number = 0;
	private _contentSize:number = 0;

	constructor() {
		super();
		this._background = this.addChild(this.backgroundFactory());
		this._thumb = this.addChild(this.thumbFactory());
		this._thumb.on(POINTER_DOWN, this.thumbPointerDownHandler, this);
		this._thumb.on(POINTER_UP, this.thumbPointerUpHandler, this);
		this._thumb.on(POINTER_UP_OUTSIDE, this.thumbPointerUpHandler, this);
	}

	private thumbPointerDownHandler(event:InteractionEvent):void {
		this._pointerDownPosition = this.getPointPosition(this._thumb.toLocal(event.data.global));
		this._thumb.on(POINTER_MOVE, this.pointerMoveHandler, this);
	}

	private thumbPointerUpHandler():void {
		this._thumb.off(POINTER_MOVE, this.pointerMoveHandler, this);
	}

	private pointerMoveHandler(event:InteractionEvent):void {
		const targetPosition:number = this.getPointPosition(this.toLocal(event.data.global)) - this._pointerDownPosition;
		const maxPosition:number = this.getMaxThumbPosition();
		const correctedPosition:number = Math.round(Math.max(0, Math.min(maxPosition, targetPosition)));
		if (this.getThumbPosition() !== correctedPosition) {
			this._percent = correctedPosition / maxPosition;
			this.refreshThumbPosition();
			this.emit(SliderAbstract.CHANGE_PERCENT, this);
		}
	}

	private refreshThumbPosition():void {
		this.setThumbPosition(Math.round(this.getMaxThumbPosition() * this._percent));
	}

	protected applySize():void {
		super.applySize();
		this.refreshVisibility();
		if (this.visible) {
			this.alignThumb();
			this.refreshThumbPosition();
			this._background.setSize(this.w, this.h);
		}
	}

	private refreshVisibility():void {
		const calculatedVisibility = this._contentSize > this.getSliderSize(); // TODO: add/remove listeners
		if (calculatedVisibility !== this.visible) {
			this.visible = calculatedVisibility;
			if (this.visible) {
				this.setPercent(0, false);
			}
		}
	}

	protected calculateThumbSize():number {
		const minThumbSize:number = 30;
		return Math.max(minThumbSize, this.getSliderSize() * (this.getSliderSize() / this._contentSize));
	}

	public setPercent(value:number, applyImmediately:boolean = true) {
		if (this._percent !== value) {
			this._percent = value;
			if (applyImmediately) {
				this.refreshThumbPosition();
			}
		}
	}

	public setContentSize(value:number, applyImmediately:boolean = false):void {
		this._contentSize = value;
		if (applyImmediately) {
			this.alignThumb();
			this.refreshThumbPosition();
		}
	}

	//////////////////////////////////
	// override methods (direction) //
	//////////////////////////////////

	protected getPointPosition(point:IPoint):number {
		return null;
	}

	protected getMaxThumbPosition():number {
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

	protected alignThumb():void {
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