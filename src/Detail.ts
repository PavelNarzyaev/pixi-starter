import View from "./View";
import Graphics = PIXI.Graphics;
import Arrows from "./Arrows";

export default class Detail extends View {
	private static readonly ARROWS_OFFSET:number = 30;

	private _graphics:Graphics;
	private _topArrows:Arrows;
	private _leftArrows:Arrows;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.initGraphics();
		this.initArrows();
	}

	private initGraphics():void {
		this._graphics = new Graphics();
		this.addChild(this._graphics);
	}

	private initArrows():void {
		this._topArrows = new Arrows();
		this._topArrows.y = -Detail.ARROWS_OFFSET - this._topArrows.h;
		this.addChild(this._topArrows);

		this._leftArrows = new Arrows();
		this._leftArrows.rotation = -Math.PI / 2;
		this._leftArrows.x = -Detail.ARROWS_OFFSET - this._leftArrows.h;
		this.addChild(this._leftArrows);
	}

	protected applySize():void {
		super.applySize();
		this.alignGraphics();
		this.alignArrows();
	}

	private alignGraphics():void {
		this._graphics.clear();

		const linesLength:number = Detail.ARROWS_OFFSET + Arrows.HEIGHT + 10;
		this.drawLine(0, this.h / 2, 0, -linesLength, 0);
		this.drawLine(this.w / 2, this.h, -linesLength, this.h, 0);
		this.drawLine(this.w / 2, 0, -linesLength, 0, 1);
		this.drawLine(this.w, this.h / 2, this.w, -linesLength, 1);

		const border:number = 10;
		this._graphics.lineStyle(3, 0x000000, 1, 0);
		this._graphics.drawRoundedRect(0, 0, this.w, this.h, 10);
		this._graphics.drawRoundedRect(border, border, this.w - 2 * border, this.h - 2 * border, 5);
	}

	private drawLine(fromX:number, fromY:number, toX:number, toY:number, alignment:number):void {
		this._graphics.lineStyle(3, 0x3f48cc, 1, alignment);
		this._graphics.moveTo(fromX, fromY);
		this._graphics.lineTo(toX, toY);
	}

	private alignArrows():void {
		this._topArrows.setW(this.w);

		this._leftArrows.y = this.h;
		this._leftArrows.setW(this.h);
	}
}