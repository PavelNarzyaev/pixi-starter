import View, {IAlignment} from "../View";
import SliderAbstractH from "./sliders/SliderAbstractH";
import SliderAbstractV from "./sliders/SliderAbstractV";
import SliderAbstract from "./sliders/SliderAbstract";
import GraphicsView from "../GraphicsView";
import IPoint = PIXI.IPoint;
import {
	POINTER_DOWN,
	POINTER_MOVE,
	POINTER_OUT,
	POINTER_OVER,
	POINTER_UP,
	POINTER_UP_OUTSIDE
} from "../../../PointerEvents";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import Container = PIXI.Container;
import Graphics = PIXI.Graphics;
import Quad = gsap.Quad;
import TweenMax = gsap.TweenMax;
import App from "../../../App";

export default class ScrollAbstract extends View {
	private static readonly EASING:any = Quad.easeOut;

	private _interactiveBackground:GraphicsView;
	private _corner:GraphicsView;
	private _contentLayer:Container;
	private _contentMovingShift:IPoint;
	private _currentMovingPoint:IPoint;
	private _movingPoints:IMovingPoint[] = [];
	private _content:View;
	private _wheelListener:(event:WheelEvent) => void;
	private _horizontalDirection:IDirection;
	private _verticalDirection:IDirection;
	private _hasVisibleSlider:boolean;
	private _currentMask:Graphics;
	private _over:boolean;

	constructor(enabledHorizontal:boolean = false, enabledVertical:boolean = true, useMask:boolean = true) {
		super();
		if (enabledHorizontal || enabledVertical) {
			this.interactive = true;
			this.on(POINTER_OVER, this.pointerOverHandler, this);
			this.on(POINTER_OUT, this.pointerOutHandler, this);
		}
		if (useMask) {
			this._currentMask = this.addChild(new Graphics());
			this.mask = this._currentMask;
		}
		this._interactiveBackground = this.addChild(new GraphicsView(0xffffff));
		this._interactiveBackground.interactive = true;
		this._interactiveBackground.alpha = 0;
		this._contentLayer = this.addChild(new Container());
		if (enabledHorizontal) {
			this._horizontalDirection = {
				slider: this.addChild(this.horizontalSliderFactory()),
				setContentPos: position => this._content.x = position,
				getContentPos: () => this._content.x,
				getScrollSize: () => this.w,
				getContentSize: () => this._content.w,
				getPointPos: (point:IPoint) => point.x,
			};
			this._horizontalDirection.slider.addListener(
				SliderAbstract.CHANGE_PERCENT,
				() => {
					this.changePercentHandler(this._horizontalDirection);
				},
				this,
			);
		}
		if (enabledVertical) {
			this._verticalDirection = {
				slider: this.addChild(this.verticalSliderFactory()),
				setContentPos: position => this._content.y = position,
				getContentPos: () => this._content.y,
				getScrollSize: () => this.h,
				getContentSize: () => this._content.h,
				getPointPos: (point:IPoint) => point.y,
			};
			this._verticalDirection.slider.addListener(
				SliderAbstract.CHANGE_PERCENT,
				() => {
					this.changePercentHandler(this._verticalDirection);
				},
				this,
			);
		}
		if (enabledHorizontal && enabledVertical) {
			this._corner = this.addChild(new GraphicsView(0x000000));
			this._corner.interactive = true;
		}
	}

	private pointerOverHandler():void {
		this._over = true;
		this.tryToAddWheelListener();
	}

	private pointerOutHandler():void {
		this._over = false;
		this.removeWheelListener();
	}

	private changePercentHandler(direction:IDirection):void {
		this.animateDirection(
			direction,
			.25,
			{ contentAnimationPos:direction.slider.getPercent() * direction.contentMinPos },
			true,
		);
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
		this.killDirectionTween(this._horizontalDirection, true);
		this.killDirectionTween(this._verticalDirection, true);
		this._contentMovingShift = this._content.toLocal(event.data.global);
		this._interactiveBackground.off(POINTER_DOWN, this.interactiveBackgroundPointerDownHandler, this);
		this._interactiveBackground.on(POINTER_UP, this.interactiveBackgroundPointerUpHandler, this);
		this._interactiveBackground.on(POINTER_UP_OUTSIDE, this.interactiveBackgroundPointerUpHandler, this);
		this._interactiveBackground.on(POINTER_MOVE, this.interactiveBackgroundMoveHandler, this);
		this._movingPoints.length = 0;
		this._currentMovingPoint = this.toLocal(event.data.global);
		App.pixi.ticker.add(this.refreshMovingPoints, this);
	}

	private refreshMovingPoints():void {
		if (this._currentMovingPoint) {
			const maxMovingPointsLength:number = 3;
			this._movingPoints.unshift({point: this._currentMovingPoint, time: performance.now()});
			if (this._movingPoints.length > maxMovingPointsLength) {
				this._movingPoints.length = maxMovingPointsLength;
			}
		}
	}

	private killDirectionTween(direction:IDirection, refreshSlider:boolean):void {
		if (direction.excludeSliderFromAnimation && refreshSlider) {
			direction.excludeSliderFromAnimation = false;
			this.refreshSliderPercent(direction);
		}
		TweenMax.killTweensOf(direction);
	}

	private interactiveBackgroundMoveHandler(event:InteractionEvent):void {
		this._currentMovingPoint = this.toLocal(event.data.global);
		this.moveContent(this._horizontalDirection, this._currentMovingPoint.x - this._contentMovingShift.x);
		this.moveContent(this._verticalDirection, this._currentMovingPoint.y - this._contentMovingShift.y);
	}

	private interactiveBackgroundPointerUpHandler():void {
		this._contentMovingShift = null;
		this._interactiveBackground.on(POINTER_DOWN, this.interactiveBackgroundPointerDownHandler, this);
		this._interactiveBackground.off(POINTER_UP, this.interactiveBackgroundPointerUpHandler, this);
		this._interactiveBackground.off(POINTER_UP_OUTSIDE, this.interactiveBackgroundPointerUpHandler, this);
		this._interactiveBackground.off(POINTER_MOVE, this.interactiveBackgroundMoveHandler, this);
		if (this._movingPoints.length >= 2) {
			this.directionDragInertia(this._horizontalDirection);
			this.directionDragInertia(this._verticalDirection);
		}
		App.pixi.ticker.remove(this.refreshMovingPoints, this);
	}

	// If you want more clear code, use https://greensock.com/inertia/ plugin
	private directionDragInertia(direction:IDirection):void {
		if (this.sliderIsVisible(direction)) {
			const firstPoint:IMovingPoint = this._movingPoints[0];
			const lastPoint:IMovingPoint = this._movingPoints[this._movingPoints.length - 1];
			const pointsShift:number = direction.getPointPos(lastPoint.point) - direction.getPointPos(firstPoint.point);
			const pointsDt:number = lastPoint.time - firstPoint.time;
			const speed:number = pointsShift / (pointsDt / 1000);
			if (Math.abs(speed) >= 1) {
				let shift:number = Math.floor(speed * .5);
				let targetPosition:number = direction.getContentPos() + shift;
				let positionWasCorrected:boolean = false;
				if (targetPosition > 0) {
					targetPosition = 0;
					positionWasCorrected = true;
				} else if (targetPosition < direction.contentMinPos) {
					targetPosition = direction.contentMinPos;
					positionWasCorrected = true;
				}
				if (positionWasCorrected) {
					shift = targetPosition - direction.getContentPos();
				}
				const accuracy:number = .001;
				const easingSpeedCorrection:number = ScrollAbstract.EASING(accuracy) / accuracy;
				const duration:number = (easingSpeedCorrection * shift) / speed;
				this.animateDirection(direction, duration, { contentAnimationPos:targetPosition });
			}
		}
	}

	private moveContent(direction:IDirection, targetPosition:number):void {
		if (this.sliderIsVisible(direction)) {
			this.setContentPosition(direction, targetPosition);
			if (!direction.excludeSliderFromAnimation) {
				this.refreshSliderPercent(direction);
			}
		}
	}

	private setContentPosition(direction:IDirection, targetPosition:number):void {
		direction.setContentPos(
			Math.max(direction.contentMinPos, Math.min(0, targetPosition))
		);
	}

	private refreshSliderPercent(direction:IDirection):void {
		direction.slider.setPercent(direction.getContentPos() / direction.contentMinPos);
		direction.slider.validate();
	}

	protected applySize():void {
		super.applySize();
		this._interactiveBackground.setSize(this.w, this.h);
		if (this._currentMask) {
			this._currentMask.clear();
			this._currentMask.beginFill(0x000000);
			this._currentMask.drawRect(0, 0, this.w, this.h);
		}
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
				this.tryToAddWheelListener();
				this._interactiveBackground.on(POINTER_DOWN, this.interactiveBackgroundPointerDownHandler, this);
			} else {
				this.removeWheelListener();
				this._wheelListener = null;
				this._interactiveBackground.off(POINTER_DOWN, this.interactiveBackgroundPointerDownHandler, this);
				this._interactiveBackground.off(POINTER_UP, this.interactiveBackgroundPointerUpHandler, this);
				this._interactiveBackground.off(POINTER_UP_OUTSIDE, this.interactiveBackgroundPointerUpHandler, this);
				this._interactiveBackground.off(POINTER_MOVE, this.interactiveBackgroundMoveHandler, this);
			}
		}
	}

	private tryToAddWheelListener():void {
		if (this._wheelListener && this._over) {
			window.addEventListener("mousewheel", this._wheelListener, {passive: false});
		}
	}

	private removeWheelListener():void {
		if (this._wheelListener) {
			window.removeEventListener("mousewheel", this._wheelListener);
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
			this.setContentPosition(direction, direction.getContentPos());
		} else {
			centerContent();
		}
	}

	private recalculateContentMinPosition(direction:IDirection):void {
		direction.contentMinPos = direction.getScrollSize() - direction.getContentSize();
	}

	private refreshSliderThumb(direction:IDirection):void {
		direction.slider.setThumbPercentSize(direction.getScrollSize() / direction.getContentSize());
	}

	private mouseWheelHandler(e:WheelEvent):void {
		let shift:number = 80;
		if (this.sliderIsVisible(this._verticalDirection)) {
			if (e.deltaY > 0) {
				shift *= -1;
			}
			this.wheelDirection(this._verticalDirection, shift);
		} else {
			if (e.deltaY < 0) {
				shift *= -1;
			}
			this.wheelDirection(this._horizontalDirection, shift);
		}
	}

	private wheelDirection(direction:IDirection, shift:number):void {
		let duration:number = .3;
		let targetPosition:number;
		if (this.animationInProgress(direction) && !this.changeAnimationDirection(direction, shift)) {
			shift = direction.contentAnimationTargetPos + shift - direction.getContentPos();
		}
		targetPosition = direction.getContentPos() + shift;
		let positionWasCorrected:boolean = false;
		if (targetPosition > 0) {
			targetPosition = 0;
			positionWasCorrected = true;
		} else if (targetPosition < direction.contentMinPos) {
			targetPosition = direction.contentMinPos;
			positionWasCorrected = true;
		}
		if (positionWasCorrected) {
			duration *= (targetPosition - direction.getContentPos()) / shift;
		}
		this.animateDirection(direction, duration, { contentAnimationPos:targetPosition });
	}

	private animateDirection(
		direction:IDirection,
		duration:number,
		tweenVars:ITweenVars,
		excludeSlider:boolean = false
	):void {
		direction.contentAnimationPos = direction.getContentPos();
		direction.contentAnimationTargetPos = tweenVars.contentAnimationPos;
		this.killDirectionTween(direction, direction.excludeSliderFromAnimation && !excludeSlider);
		direction.excludeSliderFromAnimation = excludeSlider;
		TweenMax.to(
			direction,
			duration,
			{
				...tweenVars,
				onUpdate:this.onTweenUpdate.bind(this),
				onUpdateParams:[direction],
				onComplete:this.onTweenComplete.bind(this),
				onCompleteParams:[direction],
				ease:ScrollAbstract.EASING
			}
		);
	}

	private animationInProgress(direction:IDirection):boolean {
		return direction.contentAnimationTargetPos !== undefined;
	}

	private changeAnimationDirection(direction:IDirection, shift:number) {
		return shift > 0 !== (direction.contentAnimationTargetPos - direction.contentAnimationPos) > 0;
	}

	private onTweenUpdate(direction:IDirection):void {
		this.moveContent(direction, Math.floor(direction.contentAnimationPos));
	}

	private onTweenComplete(direction:IDirection):void {
		this.moveContent(direction, direction.contentAnimationTargetPos);
		direction.excludeSliderFromAnimation = false;
		delete direction.contentAnimationTargetPos;
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
	setContentPos:(position:number) => void,
	getContentPos:() => number,
	getScrollSize:() => number,
	getContentSize:() => number,
	getPointPos:(point:IPoint) => number,
	contentMinPos?:number,
	contentAnimationPos?:number,
	contentAnimationTargetPos?:number,
	excludeSliderFromAnimation?:boolean,
}

interface ITweenVars {
	contentAnimationPos:number,
}

interface IMovingPoint {
	point:IPoint,
	time:number,
}