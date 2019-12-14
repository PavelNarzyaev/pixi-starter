import Container = PIXI.Container;
import Graphics = PIXI.Graphics;

export default class View extends Container {
	public w:number;
	public h:number;
	private _onResizeInitialized:boolean = false;
	private _testBackground:Graphics;
	private _testBackgroundColor:number;
	private _testBackgroundAlpha:number;

	constructor() {
		super();
	}

	public setW(value:number|string):void {
		if (this.w !== value) {
			this.refreshW(value);
			this.applySize();
		}
	}

	public setH(value:number|string) {
		if (this.h !== value) {
			this.refreshH(value);
			this.applySize();
		}
	}

	public setSize(w:number|string, h:number|string):void {
		if (this.w !== w || this.h !== h) {
			this.refreshW(w);
			this.refreshH(h);
			this.applySize();
		}
	}

	private refreshW(value:number|string):void {
		if (typeof value === 'number') {
			this.w = value;
		} else {
			this.w = this.calculatePixels((this.parent as View).w, value);
		}
	}

	private refreshH(value:number|string):void {
		if (typeof value === 'number') {
			this.h = value;
		} else {
			this.h = this.calculatePixels((this.parent as View).h, value);
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

		if (!this._onResizeInitialized) {
			this.onFirstResize();
			this._onResizeInitialized = true;
		}
	}

	protected onFirstResize():void {
	}

	private calculatePixels(parentSize:number, value:number|string):number {
		if (value === undefined) {
			return 0;
		} else if (typeof value === 'string') {
			return parentSize * Number(value.slice(0, -1)) / 100;
		} else {
			return Math.floor(value);
		}
	}

	public align(child:Container|View, alignment:IAlignment):void {
		let newW:number = 0;
		let newH:number = 0;
		this.alignDirection(
			alignment.left,
			alignment.w,
			alignment.right,
			this.w,
			(pos:number) => { child.x = pos; },
			(newSize) => { newW = newSize; },
		);
		this.alignDirection(
			alignment.top,
			alignment.h,
			alignment.bottom,
			this.h,
			(pos:number) => { child.y = pos; },
			(newSize:number) => { newH = newSize; },
		);
		if (child instanceof View) {
			if (newW != this.w || newH != this.h) {
				child.setSize(newW, newH);
			}
		} else {
			if (newW != child.width) {
				child.width = newW;
			}
			if (newH != child.height) {
				child.height = newH;
			}
		}
	}

	private alignDirection(
		beforeSize:number|string,
		size:number|string,
		afterSize:number|string,
		parentSize:number,
		setPos:(pos:number) => void,
		setSize:(newSize:number) => void,
	):void {
		if (size === undefined) {
			const pos:number = this.calculatePixels(parentSize, beforeSize);
			setPos(pos);
			setSize(parentSize - pos - this.calculatePixels(parentSize, afterSize));
		} else if (afterSize === undefined) {
			setSize(this.calculatePixels(parentSize, size));
			setPos(this.calculatePixels(parentSize, beforeSize));
		} else if (beforeSize === undefined) {
			const newSize:number = this.calculatePixels(parentSize, size);
			setSize(newSize);
			setPos(parentSize - newSize - this.calculatePixels(parentSize, afterSize));
		}
	}

	public center(child:Container|View):void {
		this.centerX(child);
		this.centerY(child);
	}

	public centerX(child:Container|View):void {
		const childWidth:number = child instanceof View ? child.w : child.width;
		child.x = Math.floor((this.w - childWidth) / 2);
	}

	public centerY(child:Container|View):void {
		const childHeight:number = child instanceof View ? child.h : child.height;
		child.y = Math.floor((this.h - childHeight) / 2);
	}
}

export interface IAlignment {
	left?:number|string;
	right?:number|string;
	top?:number|string;
	bottom?:number|string;
	w?:number|string;
	h?:number|string;
}
