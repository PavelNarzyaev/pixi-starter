import Container = PIXI.Container;
import Graphics = PIXI.Graphics;
import {genRandomColor} from "../../Random";

export default class View extends Container {
	public static readonly RESIZE:symbol = Symbol();

	public w:number;
	public h:number;
	private _testBackground:Graphics;
	private _testBackgroundColor:number;
	private _testBackgroundAlpha:number;

	public setSize(w:number, h:number, emitResizeEvent:boolean = false):void {
		const newW:number = this.calculatePixels(w);
		const newH:number = this.calculatePixels(h);
		if (this.w !== newW || this.h !== newH) {
			this.w = newW;
			this.h = newH;
			this.applySize();
			if (emitResizeEvent) {
				this.emit(View.RESIZE);
			}
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
		beforeSize:number,
		size:number,
		afterSize:number,
		parentSize:number,
		setPos:(pos:number) => void,
		setSize:(newSize:number) => void,
	):void {
		if (size === undefined) {
			const newPos:number = this.calculatePixels(beforeSize);
			setPos(newPos);
			setSize(parentSize - newPos - this.calculatePixels(afterSize));
		} else if (afterSize === undefined) {
			setSize(this.calculatePixels(size));
			setPos(this.calculatePixels(beforeSize));
		} else if (beforeSize === undefined) {
			const newSize:number = this.calculatePixels(size);
			setSize(newSize);
			setPos(parentSize - newSize - this.calculatePixels(afterSize));
		}
	}

	private calculatePixels(value:number):number {
		return value ? Math.floor(value) : 0;
	}

	public center(child:Container|View):void {
		this.centerHorizontal(child);
		this.centerVertical(child);
	}

	public centerHorizontal(child:Container|View):void {
		const childWidth:number = child instanceof View ? child.w : child.width;
		child.x = Math.floor((this.w - childWidth) / 2);
	}

	public centerVertical(child:Container|View):void {
		const childHeight:number = child instanceof View ? child.h : child.height;
		child.y = Math.floor((this.h - childHeight) / 2);
	}

	//////////////////////
	// override methods //
	//////////////////////

	protected applySize():void {
		if (this._testBackground) {
			this._testBackground.clear();
			this._testBackground.lineStyle(2, this._testBackgroundColor, 1, 0);
			this._testBackground.beginFill(this._testBackgroundColor, this._testBackgroundAlpha);
			this._testBackground.drawRect(0, 0, this.w, this.h);
		}
	}

	//////////////////
	// test methods //
	//////////////////

	public showTestBackground(color?:number, alpha:number = .5):void {
		if (!this._testBackground) {
			this._testBackground = new Graphics();
			this.addChildAt(this._testBackground, 0);
		}
		this._testBackgroundColor = color ? color : genRandomColor();
		this._testBackgroundAlpha = alpha;
		if (this.w && this.h) {
			this.applySize();
		}
	}

	public getStringSize():string {
		return this.w + "x" + this.h;
	}
}

export interface IAlignment {
	left?:number;
	right?:number;
	top?:number;
	bottom?:number;
	w?:number;
	h?:number;
}
