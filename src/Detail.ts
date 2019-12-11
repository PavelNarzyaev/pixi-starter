import View from "./View";
import Graphics = PIXI.Graphics;

export default class Detail extends View {
	private _graphics:Graphics;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.initGraphics();
	}

	private initGraphics():void {
		this._graphics = new Graphics();
		this.addChild(this._graphics);
	}

	protected applySize():void {
		super.applySize();
		this.alignGraphics();
	}

	private alignGraphics():void {
		const border:number = 10;
		const linesLength:number = 50;

		this._graphics.clear();
		
		this.drawLine(0, this.h / 2, 0, -linesLength, 0);
		this.drawLine(this.w / 2, this.h, -linesLength, this.h, 0);
		this.drawLine(this.w / 2, 0, -linesLength, 0, 1);
		this.drawLine(this.w, this.h / 2, this.w, -linesLength, 1);

		this._graphics.lineStyle(3, 0x000000, 1, 0);
		this._graphics.drawRoundedRect(0, 0, this.w, this.h, 10);
		this._graphics.drawRoundedRect(border, border, this.w - 2 * border, this.h - 2 * border, 5);
	}

	private drawLine(fromX:number, fromY:number, toX:number, toY:number, alignment:number):void {
		this._graphics.lineStyle(3, 0x3f48cc, 1, alignment);
		this._graphics.moveTo(fromX, fromY);
		this._graphics.lineTo(toX, toY);
	}
}