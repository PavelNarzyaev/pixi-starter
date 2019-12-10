import Container = PIXI.Container;
import Graphics = PIXI.Graphics;

export default class View extends Container {
	public w:number;
	public h:number;
	private _initialized:boolean = false;
	private _testBackground:Graphics;
	private _testBackgroundColor:number;
	private _testBackgroundAlpha:number;

	constructor() {
		super();
	}

	public setW(value:number):void {
		if (this.w !== value) {
			this.w = value;
			this.applySize();
		}
	}

	public setH(value:number) {
		if (this.h !== value) {
			this.h = value;
			this.applySize();
		}
	}

	public setSize(w:number, h:number):void {
		if (this.w !== w || this.h !== h) {
			this.w = w;
			this.h = h;
			this.applySize();
		}
	}

	public showTestBackground(color?:number, alpha:number = .5):void {
		if (!this._testBackground) {
			this._testBackground = new Graphics();
			this.addChildAt(this._testBackground, 0);
			this._testBackgroundColor = color ? color : Math.floor(Math.random() * 0x1000000);
			this._testBackgroundAlpha = alpha;
			if (this.w && this.h) {
				this.applySize();
			}
		}
	}

	protected applySize():void {
		if (this._testBackground) {
			this._testBackground.clear();
			this._testBackground.lineStyle(1, this._testBackgroundColor);
			this._testBackground.beginFill(this._testBackgroundColor, this._testBackgroundAlpha);
			this._testBackground.drawRect(0, 0, this.w, this.h);
			this._testBackground.endFill();
		}

		if (!this._initialized) {
			this.init();
			this._initialized = true;
		}
	}

	protected init():void {
	}
}
