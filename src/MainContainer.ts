import View from "./View";
import Arrows from "./Arrows";

export default class MainContainer extends View {
	private _horizontalArrows:Arrows;
	private _verticalArrows:Arrows;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.initHorizontalArrows();
		this.initVerticalArrows();
	}

	private initHorizontalArrows():void {
		this._horizontalArrows = new Arrows("100%");
		this.addChild(this._horizontalArrows);
	}

	private initVerticalArrows():void {
		this._verticalArrows = new Arrows("100%");
		this._verticalArrows.rotation = -Math.PI / 2;
		this.addChild(this._verticalArrows);
	}

	protected applySize():void {
		super.applySize();
		this.alignHorizontalArrows();
		this.alignVerticalArrows();
	}

	private alignHorizontalArrows():void {
		this._horizontalArrows.setW(this.w);
		this._horizontalArrows.y = this.h - this._horizontalArrows.h - 30;
	}

	private alignVerticalArrows():void {
		this._verticalArrows.setW(this.h);
		this._verticalArrows.x = this.w - this._horizontalArrows.h - 30;
		this._verticalArrows.y = Math.floor(this.h);
	}
}