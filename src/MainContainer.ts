import View from "./View";
import Arrows from "./Arrows";
import Detail from "./Detail";

export default class MainContainer extends View {
	private _horizontalArrows:Arrows;
	private _verticalArrows:Arrows;
	private _detail:Detail;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.initHorizontalArrows();
		this.initVerticalArrows();
		this.initDetail();
	}

	private initHorizontalArrows():void {
		this._horizontalArrows = new Arrows();
		this.addChild(this._horizontalArrows);
	}

	private initVerticalArrows():void {
		this._verticalArrows = new Arrows();
		this._verticalArrows.rotation = -Math.PI / 2;
		this.addChild(this._verticalArrows);
	}

	private initDetail():void {
		this._detail = new Detail();
		this.addChild(this._detail);
	}

	protected applySize():void {
		super.applySize();
		this.alignHorizontalArrows();
		this.alignVerticalArrows();
		this.alignDetail();
	}

	private alignHorizontalArrows():void {
		this._horizontalArrows.setW(this.w);
		this._horizontalArrows.y = this.h - this._horizontalArrows.h - 30;
		this._horizontalArrows.setText("100% (" + this._horizontalArrows.w + "px)");
	}

	private alignVerticalArrows():void {
		this._verticalArrows.setW(this.h);
		this._verticalArrows.x = this.w - this._verticalArrows.h - 30;
		this._verticalArrows.y = Math.floor(this.h);
		this._verticalArrows.setText("100% (" + this._verticalArrows.w + "px)")
	}

	private alignDetail():void {
		this._detail.setSize(Math.floor(this.w * .3), 150);
		this._detail.x = Math.floor((this.w - this._detail.w) / 2);
		this._detail.y = Math.floor((this.h - this._detail.h) / 2);
	}
}