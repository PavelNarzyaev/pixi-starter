import View, {IAlignment} from "../View";
import SliderAbstractH from "./sliders/SliderAbstractH";
import SliderAbstractV from "./sliders/SliderAbstractV";
import SliderAbstract from "./sliders/SliderAbstract";
import GraphicsView from "../GraphicsView";
import IPoint = PIXI.IPoint;
import {POINTER_DOWN, POINTER_MOVE, POINTER_UP, POINTER_UP_OUTSIDE} from "../../../PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import Container = PIXI.Container;

export default class ScrollAbstract extends View {
	private _interactiveBackground:GraphicsView;
	private _corner:GraphicsView;
	private _contentLayer:Container;
	private _contentMovingShift:IPoint;
	private _content:View;
	private _wheelListener:(event:WheelEvent) => void;
	private _horizontalDirection:IDirection;
	private _verticalDirection:IDirection;
	private _hasVisibleSlider:boolean;

	constructor(enabledHorizontal:boolean = false, enabledVertical:boolean = true) {
		super();
		this._interactiveBackground = this.addChild(new GraphicsView(0xffffff));
		this._interactiveBackground.interactive = true;
		this._interactiveBackground.alpha = 0;
		this._contentLayer = this.addChild(new Container());
		if (enabledHorizontal) {
			this._horizontalDirection = {
				slider: this.addChild(this.horizontalSliderFactory()),
				setContentPosition: position => this._content.x = position,
				getContentPosition: () => this._content.x,
				getScrollSize: () => this.w,
				getContentSize: () => this._content.w,
			};
			this._horizontalDirection.slider.addListener(
				SliderAbstract.CHANGE_PERCENT,
				() => {
					this.refreshContentPosition(this._horizontalDirection);
				},
				this,
			);
		}
		if (enabledVertical) {
			this._verticalDirection = {
				slider: this.addChild(this.verticalSliderFactory()),
				setContentPosition: position => this._content.y = position,
				getContentPosition: () => this._content.y,
				getScrollSize: () => this.h,
				getContentSize: () => this._content.h,
			};
			this._verticalDirection.slider.addListener(
				SliderAbstract.CHANGE_PERCENT,
				() => {
					this.refreshContentPosition(this._verticalDirection);
				},
				this,
			);
		}
		if (enabledHorizontal && enabledVertical) {
			this._corner = this.addChild(new GraphicsView(0x000000));
			this._corner.interactive = true;
		}
	}

	private refreshContentPosition(direction:IDirection):void {
		direction.setContentPosition(Math.floor(direction.slider.getPercent() * direction.contentMinPosition));
	}

	public addContent<T extends View>(content:T):T {
		this._content = this._contentLayer.addChild(content);
		this._content.addListener(View.RESIZE, this.refresh, this);
		return content;
	}

	public removeContent():void {
		if (this._content) {
			this._content.removeListener(View.RESIZE, this.refresh, this);
			this._content.parent.removeChild(this._content);
		}
	}

	private interactiveBackgroundPointerDownHandler(event:InteractionEvent):void {
		this._contentMovingShift = this._content.toLocal(event.data.global);
		this._interactiveBackground.on(POINTER_MOVE, this.interactiveBackgroundMoveHandler, this);
	}

	private interactiveBackgroundPointerUpHandler():void {
		this._contentMovingShift = null;
		this._interactiveBackground.off(POINTER_MOVE, this.interactiveBackgroundMoveHandler, this);
	}

	private interactiveBackgroundMoveHandler(event:InteractionEvent):void {
		const eventPoint:IPoint = this.toLocal(event.data.global);
		this.moveContent(this._horizontalDirection, eventPoint.x - this._contentMovingShift.x);
		this.moveContent(this._verticalDirection, eventPoint.y - this._contentMovingShift.y);
	}

	private moveContent(direction:IDirection, targetPosition:number):void {
		if (this.sliderIsVisible(direction)) {
			this.setContentPosition(direction, targetPosition);
			this.refreshSliderPercent(direction);
		}
	}

	private setContentPosition(direction:IDirection, targetPosition:number):void {
		direction.setContentPosition(
			Math.max(direction.contentMinPosition, Math.min(0, targetPosition))
		);
	}

	private refreshSliderPercent(direction:IDirection):void {
		direction.slider.setPercent(direction.getContentPosition() / direction.contentMinPosition);
		direction.slider.validate();
	}

	protected applySize():void {
		super.applySize();
		this._interactiveBackground.setSize(this.w, this.h);
		this.refresh();
	}

	private refresh():void {
		this.refreshSliderVisibility(this._horizontalDirection);
		this.refreshSliderVisibility(this._verticalDirection);
		this.refreshByDirection(
			this._horizontalDirection,
			{
				bottom: 0,
				w: this.sliderIsVisible(this._verticalDirection) ? this.w - this.getSliderThickness() : this.w,
				h: this.getSliderThickness(),
			},
			() => this.centerHorizontal(this._content),
		);
		this.refreshByDirection(this._verticalDirection,
			{
				right: 0,
				w: this.getSliderThickness(),
				h: this.sliderIsVisible(this._horizontalDirection) ? this.h - this.getSliderThickness() : this.h,
			},
			() => this.centerVertical(this._content),
		);
		this.alignCorner();

		let hasVisibleSlider:boolean =
			this.sliderIsVisible(this._verticalDirection) ||
			this.sliderIsVisible(this._horizontalDirection);
		if (this._hasVisibleSlider !== hasVisibleSlider) {
			this._hasVisibleSlider = hasVisibleSlider;
			if (this._hasVisibleSlider) {
				this._wheelListener = this.mouseWheelHandler.bind(this);
				window.addEventListener("mousewheel", this._wheelListener, {passive: false});

				this._interactiveBackground.on(POINTER_DOWN, this.interactiveBackgroundPointerDownHandler, this);
				this._interactiveBackground.on(POINTER_UP, this.interactiveBackgroundPointerUpHandler, this);
				this._interactiveBackground.on(POINTER_UP_OUTSIDE, this.interactiveBackgroundPointerUpHandler, this);
			} else {
				window.removeEventListener("mousewheel", this._wheelListener);
				this._wheelListener = null;

				this._interactiveBackground.off(POINTER_DOWN, this.interactiveBackgroundPointerDownHandler, this);
				this._interactiveBackground.off(POINTER_UP, this.interactiveBackgroundPointerUpHandler, this);
				this._interactiveBackground.off(POINTER_UP_OUTSIDE, this.interactiveBackgroundPointerUpHandler, this);
			}
		}
	}

	private refreshSliderVisibility(direction:IDirection):void {
		direction.slider.visible = direction && direction.getScrollSize() < direction.getContentSize();
	}

	private sliderIsVisible(direction:IDirection):boolean {
		return direction && direction.slider && direction.slider.visible;
	}

	private refreshByDirection(direction:IDirection, sliderAlignment:IAlignment, centerContent:() => void):void {
		if (this.sliderIsVisible(direction)) {
			this.recalculateContentMinPosition(direction);
			this.refreshSliderPercent(direction);
			this.refreshSliderThumb(direction);
			this.align(direction.slider, sliderAlignment);
			direction.slider.validate();
			this.setContentPosition(direction, direction.getContentPosition());
		} else {
			centerContent();
		}
	}

	private recalculateContentMinPosition(direction:IDirection):void {
		direction.contentMinPosition = direction.getScrollSize() - direction.getContentSize();
	}

	private refreshSliderThumb(direction:IDirection):void {
		direction.slider.setThumbPercentSize(direction.getScrollSize() / direction.getContentSize());
	}

	private mouseWheelHandler(e:WheelEvent):void {
		let shift:number = 50;
		if (this.sliderIsVisible(this._verticalDirection)) {
			if (e.deltaY > 0) {
				shift *= -1;
			}
			this.moveContent(this._verticalDirection, this._content.y + shift);
		} else {
			if (e.deltaY < 0) {
				shift *= -1;
			}
			this.moveContent(this._horizontalDirection, this._content.x + shift);
		}
	}

	private alignCorner():void {
		if (this._corner) {
			this._corner.visible =
				this.sliderIsVisible(this._horizontalDirection) &&
				this.sliderIsVisible(this._verticalDirection);
			if (this._corner.visible) {
				this.align(
					this._corner,
					{
						right: 0,
						bottom: 0,
						w: this.getSliderThickness(),
						h: this.getSliderThickness(),
					}
				)
			}
		}
	}

	//////////////////////
	// override methods //
	//////////////////////

	protected getSliderThickness():number {
		return 20;
	}

	protected horizontalSliderFactory():SliderAbstractH {
		return null;
	}

	protected verticalSliderFactory():SliderAbstractV {
		return null;
	}
}

interface IDirection {
	slider:SliderAbstract,
	setContentPosition:(position:number) => void,
	getContentPosition:() => number,
	getScrollSize:() => number,
	getContentSize:() => number,
	contentMinPosition?:number,
}