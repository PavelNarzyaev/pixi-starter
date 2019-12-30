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
	private _horizontalSlider:SliderAbstractH;
	private _verticalSlider:SliderAbstractV;
	private _corner:GraphicsView;
	private _contentLayer:Container;
	private _contentMovingShift:IPoint;
	private _content:View;
	private _wheelListener:(event:WheelEvent) => void;

	constructor(
		private _enabledHorizontal:boolean = false,
		private _enabledVertical:boolean = true,
	) {
		super();
		this._interactiveBackground = this.addChild(new GraphicsView(0xffffff));
		this._interactiveBackground.interactive = true;
		this._interactiveBackground.alpha = 0;
		this._interactiveBackground.on(POINTER_DOWN, this.interactiveBackgroundPointerDownHandler, this);
		this._interactiveBackground.on(POINTER_UP, this.interactiveBackgroundPointerUpHandler, this);
		this._interactiveBackground.on(POINTER_UP_OUTSIDE, this.interactiveBackgroundPointerUpHandler, this);
		this._contentLayer = this.addChild(new Container());
		if (this._enabledHorizontal) {
			this._horizontalSlider = this.addChild(this.horizontalSliderFactory());
			this._horizontalSlider.addListener(
				SliderAbstract.CHANGE_PERCENT,
				() => {
					this.refreshContentPosition(
						this.w,
						this._content.w,
						this._horizontalSlider.getPercent(),
						position => this._content.x = position,
					)
				},
				this,
			);
		}
		if (this._enabledVertical) {
			this._verticalSlider = this.addChild(this.verticalSliderFactory());
			this._verticalSlider.addListener(
				SliderAbstract.CHANGE_PERCENT,
				() => {
					this.refreshContentPosition(
						this.h,
						this._content.h,
						this._verticalSlider.getPercent(),
						position => this._content.y = position,
					)
				},
				this,
			);
		}
		if (this._enabledVertical && this._enabledHorizontal) {
			this._corner = this.addChild(new GraphicsView(0x000000));
			this._corner.interactive = true;
		}
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
		this.moveContentByX(eventPoint.x - this._contentMovingShift.x);
		this.moveContentByY(eventPoint.y - this._contentMovingShift.y);
	}

	private moveContentByX(targetX:number):void {
		this.moveContent(
			this._horizontalSlider,
			this.w,
			this._content.w,
			targetX,
			position => this._content.x = position,
		);
	}

	private moveContentByY(targetY:number):void {
		this.moveContent(
			this._verticalSlider,
			this.h,
			this._content.h,
			targetY,
			position => this._content.y = position,
		);
	}

	private moveContent(
		slider:SliderAbstract,
		currentSize:number,
		contentSize:number,
		targetPosition:number,
		setPosition:(position:number) => void
	):void {
		if (this.sliderIsVisible(slider)) {
			const minPosition:number = currentSize - contentSize;
			const correctedPosition:number = Math.max(minPosition, Math.min(0, targetPosition));
			setPosition(correctedPosition);
			slider.setPercent(correctedPosition / minPosition);
			slider.validate();
		}
	}

	private refreshContentPosition(
		currentSize:number,
		contentSize:number,
		percent:number,
		setPosition:(position:number) => void
	):void {
		const minPosition:number = currentSize - contentSize;
		setPosition(Math.max(minPosition, Math.min(0, minPosition * percent)));
	}

	protected applySize():void {
		super.applySize();
		this._interactiveBackground.setSize(this.w, this.h);
		this.refresh();
	}

	private refresh():void {
		this.refreshSliderVisibility(this._horizontalSlider, this.w, this._content.w);
		this.refreshSliderVisibility(this._verticalSlider, this.h, this._content.h);
		this.refreshDirection(
			this._horizontalSlider,
			this.w,
			this._content.w,
			this._content.x,
			{
				bottom: 0,
				w: this.sliderIsVisible(this._verticalSlider) ? this.w - this.getSliderThickness() : this.w,
				h: this.getSliderThickness(),
			},
			() => this.centerHorizontal(this._content),
			position => this._content.x = position
		);
		this.refreshDirection(
			this._verticalSlider,
			this.h,
			this._content.h,
			this._content.y,
			{
				right: 0,
				w: this.getSliderThickness(),
				h: this.sliderIsVisible(this._horizontalSlider) ? this.h - this.getSliderThickness() : this.h,
			},
			() => this.centerVertical(this._content),
			position => this._content.y = position
		);
		this.alignCorner();
		const hasVisibleSlider:boolean = this.sliderIsVisible(this._verticalSlider) || this.sliderIsVisible(this._horizontalSlider);
		if (!this._wheelListener && hasVisibleSlider) {
			this._wheelListener = this.mouseWheelHandler.bind(this);
			window.addEventListener("mousewheel", this._wheelListener, { passive:false });
		} else if (this._wheelListener && !hasVisibleSlider) {
			window.removeEventListener("mousewheel", this._wheelListener);
			this._wheelListener = null;
		}
	}

	private mouseWheelHandler(e:WheelEvent):void {
		let shift:number = 50;
		if (this.sliderIsVisible(this._verticalSlider)) {
			if (e.deltaY > 0) {
				shift *= -1;
			}
			this.moveContentByY(this._content.y + shift);
		} else {
			if (e.deltaY < 0) {
				shift *= -1;
			}
			this.moveContentByX(this._content.x + shift);
		}
	}

	private refreshSliderVisibility(slider:SliderAbstract, currentSize:number, contentSize:number):void {
		slider.visible = currentSize < contentSize;
	}

	private refreshDirection(
		slider:SliderAbstract,
		currentSize:number,
		contentSize:number,
		contentPosition:number,
		sliderAlignment:IAlignment,
		centerContent:() => void,
		setContentPosition:(position:number) => void,
	):void {
		if (this.sliderIsVisible(slider)) {
			const minContentPosition:number = currentSize - contentSize;
			slider.setPercent(contentPosition / minContentPosition);
			slider.setThumbPercentSize(currentSize / contentSize);
			this.align(slider, sliderAlignment);
			slider.validate();

			setContentPosition(Math.max(minContentPosition, Math.min(0, contentPosition)));
		} else {
			centerContent();
		}
	}

	private alignCorner():void {
		if (this._corner) {
			this._corner.visible = this.sliderIsVisible(this._horizontalSlider) && this.sliderIsVisible(this._verticalSlider);
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

	private sliderIsVisible(slider:SliderAbstract):boolean {
		return slider && slider.visible;
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