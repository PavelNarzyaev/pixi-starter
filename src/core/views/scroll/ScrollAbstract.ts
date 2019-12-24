import View from "../View";
import SliderAbstractH from "./sliders/SliderAbstractH";
import SliderAbstractV from "./sliders/SliderAbstractV";
import SliderAbstract from "./sliders/SliderAbstract";
import DisplayObject = PIXI.DisplayObject;
import GraphicsView from "../GraphicsView";

export default class ScrollAbstract extends View {
	private _horizontalSlider:SliderAbstractH;
	private _verticalSlider:SliderAbstractV;
	private _corner:GraphicsView;
	private _contentContainer:View;

	constructor(
		private _enabledHorizontal:boolean = false,
		private _enabledVertical:boolean = true,
	) {
		super();
		this._contentContainer = this.addChild(new View());
		if (this._enabledHorizontal) {
			this._horizontalSlider = this.addChild(this.horizontalSliderFactory());
			this._horizontalSlider.addListener(
				SliderAbstract.CHANGE_PERCENT,
				() => {
					this.refreshContentPosition(
						this.w,
						this._contentContainer.w,
						this._horizontalSlider.getPercent(),
						position => this._contentContainer.x = position,
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
						this._contentContainer.h,
						this._verticalSlider.getPercent(),
						position => this._contentContainer.y = position,
					)
				},
				this,
			);
		}
		if (this._enabledVertical && this._enabledHorizontal) {
			this._corner = this.addChild(new GraphicsView(0x000000));
		}
	}

	public setContainerSize(w:number, h:number, applyImmediately:boolean = false):void {
		this._contentContainer.setSize(w, h);
		if (this._horizontalSlider) {
			this._horizontalSlider.setThumbPercentSize(this.w / this._contentContainer.w, applyImmediately);
		}
		if (this._verticalSlider) {
			this._verticalSlider.setThumbPercentSize(this.h / this._contentContainer.h, applyImmediately);
		}
	}

	public addContent(content:DisplayObject):void {
		this._contentContainer.addChild(content);
	}

	public removeContent(content:DisplayObject):void {
		this._contentContainer.removeChild(content);
	}

	private refreshContentPosition(
		currentSize:number,
		contentSize:number,
		percent:number,
		setContentPosition:(position:number) => void
	):void {
		const minPosition:number = currentSize - contentSize;
		setContentPosition(Math.max(minPosition, Math.min(0, minPosition * percent)));
	}

	protected applySize():void {
		super.applySize();
		this.refreshSliders();
		this.alignSliders();
		this.alignCorner();
		this.alignContainer();
	}

	private refreshSliders():void {
		this.refreshSlider(
			this._horizontalSlider,
			this.w,
			this._contentContainer.w,
			this._contentContainer.x,
			position => this._contentContainer.x = position
		);
		this.refreshSlider(
			this._verticalSlider,
			this.h,
			this._contentContainer.h,
			this._contentContainer.y,
			position => this._contentContainer.y = position
		);
	}

	private refreshSlider(
		slider:SliderAbstract,
		currentSize:number,
		contentSize:number,
		contentPosition:number,
		setContentPosition:(position:number) => void
	):void {
		if (slider) {
			slider.visible = currentSize < contentSize;
			if (slider.visible) {
				const minPosition:number = currentSize - contentSize;
				const calculatedPercent:number = minPosition !== 0 ? contentPosition / minPosition : 0;
				slider.setPercent(calculatedPercent, false);
				slider.setThumbPercentSize(currentSize / contentSize, false);
				if (calculatedPercent > 1) {
					setContentPosition(minPosition);
				}
			}
		}
	}

	private alignSliders():void {
		if (this.horizontalSliderIsVisible()) {
			this.align(
				this._horizontalSlider,
				{
					bottom: 0,
					w: this.verticalSliderIsVisible() ? this.w - this.getSliderThickness() : this.w,
					h: this.getSliderThickness(),
				}
			);
		}
		if (this.verticalSliderIsVisible()) {
			this.align(
				this._verticalSlider,
				{
					right: 0,
					w: this.getSliderThickness(),
					h: this.horizontalSliderIsVisible() ? this.h - this.getSliderThickness() : this.h,
				}
			);
		}
	}

	private horizontalSliderIsVisible():boolean {
		return this._horizontalSlider && this._horizontalSlider.visible;
	}

	private verticalSliderIsVisible():boolean {
		return this._verticalSlider && this._verticalSlider.visible;
	}

	private alignCorner():void {
		if (this._corner) {
			this._corner.visible = this.horizontalSliderIsVisible() && this.verticalSliderIsVisible();
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

	private alignContainer():void {
		if (!this.horizontalSliderIsVisible()) {
			this.centerHorizontal(this._contentContainer);
		}
		if (!this.verticalSliderIsVisible()) {
			this.centerVertical(this._contentContainer);
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