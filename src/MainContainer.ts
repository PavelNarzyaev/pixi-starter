import View from "./View";
import Arrows from "./Arrows";

export default class MainContainer extends View {
	private _horizontalArrows:Arrows;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.initHorizontalArrows();
	}

	private initHorizontalArrows():void {
		this._horizontalArrows = new Arrows("100%");
		this.addChild(this._horizontalArrows);
	}

	protected applySize():void {
		super.applySize();
		this.alignHorizontalArrows();
	}

	private alignHorizontalArrows():void {
		this._horizontalArrows.setW(this.w);
		this._horizontalArrows.y = this.h / 2;
	}
}