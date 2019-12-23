import View from "./View";
import Thumb from "./Thumb";
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "../../PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;

export default class SliderAbstract extends View {
	public static readonly CHANGE_PERCENT:symbol = Symbol();
	private _background:View;
	private _thumb:Thumb;
	private _percent:number = 0;
	private _contentHeight:number = 0;

	constructor() {
		super();
		this._background = this.addChild(this.backgroundFactory());
		this._thumb = this.addChild(this.thumbFactory());
		this._thumb.on(POINTER_DOWN, this.thumbPointerDownHandler, this);
		this._thumb.on(POINTER_UP, this.thumbPointerUpHandler, this);
		this._thumb.on(POINTER_UP_OUTSIDE, this.thumbPointerUpHandler, this);
	}

	private thumbPointerDownHandler(event:InteractionEvent):void {
		this._thumb.pressY = this._thumb.toLocal(event.data.global).y;
		this._thumb.on(POINTER_MOVE, this.pointerMoveHandler, this);
	}

	private thumbPointerUpHandler():void {
		this._thumb.off(POINTER_MOVE, this.pointerMoveHandler, this);
	}

	protected backgroundFactory():View {
		return null;
	}

	protected thumbFactory():Thumb {
		return null;
	}

	private pointerMoveHandler(event:InteractionEvent):void {
		const targetY:number = this.toLocal(event.data.global).y - this._thumb.pressY;
		const maxY:number = this.h - this._thumb.h;
		const correctedY:number = Math.round(Math.max(0, Math.min(maxY, targetY)));
		if (this._thumb.y !== correctedY) {
			this._percent = correctedY / maxY;
			this.refreshThumbY();
			this.emit(SliderAbstract.CHANGE_PERCENT, this);
		}
	}

	private refreshThumbY():void {
		const maxY:number = this.h - this._thumb.h;
		this._thumb.y = Math.round(maxY * this._percent);
	}

	protected applySize():void {
		super.applySize();
		this.refreshVisibility();
		if (this.visible) {
			this.alignThumb();
			this.refreshThumbY();
			this._background.setSize(this.w, this.h);
		}
	}

	private refreshVisibility():void {
		this.visible = this._contentHeight > this.h; // TODO: add/remove listeners
	}

	private alignThumb():void {
		const minThumbHeight:number = 30;
		this._thumb.setSize(this.w, Math.max(minThumbHeight, this.h * (this.h / this._contentHeight)));
	}

	public setPercent(value:number) {
		if (this._percent !== value) {
			this._percent = value;
			if (this.w && this.h) {
				this.refreshThumbY();
			}
		}
	}

	public setContentHeight(value:number, applyImmediately:boolean = false):void {
		this._contentHeight = value;
		if (applyImmediately) {
			this.alignThumb();
			this.refreshThumbY();
		}
	}
}