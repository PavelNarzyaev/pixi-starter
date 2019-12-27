import View, {IAlignment} from "../View";
import SliderAbstractH from "./sliders/SliderAbstractH";
import SliderAbstractV from "./sliders/SliderAbstractV";
import SliderAbstract from "./sliders/SliderAbstract";
import GraphicsView from "../GraphicsView";

export default class ScrollAbstract extends View {
	private _horizontalSlider:SliderAbstractH;
	private _verticalSlider:SliderAbstractV;
	private _corner:GraphicsView;
	private _contentContainer:View;
	private _content:View;

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

	public addContent<T extends View>(content:T):T {
		this._content = this._contentContainer.addChild(content);
		this._content.x = this._content.y = this.getSliderThickness();
		this._content.addListener(View.RESIZE, this.refresh, this);
		return content;
	}

	public removeContent():void {
		if (this._content) {
			this._content.removeListener(View.RESIZE, this.refresh, this);
			this._content.parent.removeChild(this._content);
		}
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
		this.refresh();
	}

	private refresh():void {
		this.refreshContainerSize();
		this.refreshSliderVisibility(this._horizontalSlider, this.w, this._contentContainer.w);
		this.refreshSliderVisibility(this._verticalSlider, this.h, this._contentContainer.h);
		this.refreshDirection(
			this._horizontalSlider,
			this.w,
			this._contentContainer.w,
			this._contentContainer.x,
			{
				bottom: 0,
				w: this.sliderIsVisible(this._verticalSlider) ? this.w - this.getSliderThickness() : this.w,
				h: this.getSliderThickness(),
			},
			() => this.centerHorizontal(this._contentContainer),
			position => this._contentContainer.x = position
		);
		this.refreshDirection(
			this._verticalSlider,
			this.h,
			this._contentContainer.h,
			this._contentContainer.y,
			{
				right: 0,
				w: this.getSliderThickness(),
				h: this.sliderIsVisible(this._horizontalSlider) ? this.h - this.getSliderThickness() : this.h,
			},
			() => this.centerVertical(this._contentContainer),
			position => this._contentContainer.y = position
		);
		this.alignCorner();
	}

	private refreshSliderVisibility(slider:SliderAbstract, currentSize:number, contentSize:number):void {
		slider.visible = currentSize < contentSize;
	}

	private refreshContainerSize():void {
		const increaseContainerSize:number = this.getSliderThickness() * 2;
		this._contentContainer.setSize(
			this._content.w + increaseContainerSize,
			this._content.h + increaseContainerSize,
		);
	}

	private refreshDirection(
		slider:SliderAbstract,
		currentSize:number,
		containerSize:number,
		containerPosition:number,
		sliderAlignment:IAlignment,
		centerContainer:() => void,
		setContainerPosition:(position:number) => void,
	):void {
		if (this.sliderIsVisible(slider)) {
			const minContainerPosition:number = currentSize - containerSize;
			const calculatedPercent:number = minContainerPosition !== 0 ? containerPosition / minContainerPosition : 0;
			slider.setPercent(calculatedPercent);
			slider.setThumbPercentSize(currentSize / containerSize);
			this.align(slider, sliderAlignment);
			slider.validate();

			setContainerPosition(Math.max(minContainerPosition, Math.min(0, containerPosition)));
		} else {
			centerContainer();
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