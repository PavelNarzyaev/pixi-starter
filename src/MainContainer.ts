import View from "./View";
import Arrows from "./Arrows";
import Detail from "./Detail";

export default class MainContainer extends View {
	private _widthArrows:Arrows;
	private _heightArrows:Arrows;
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
		this._widthArrows = new Arrows();
		this.addChild(this._widthArrows);
	}

	private initVerticalArrows():void {
		this._heightArrows = new Arrows();
		this._heightArrows.rotation = -Math.PI / 2;
		this.addChild(this._heightArrows);
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
		this._widthArrows.setW(this.w);
		this._widthArrows.y = this.h - this._widthArrows.h - 30;
		this._widthArrows.setText("100% (" + this._widthArrows.w + "px)");
	}

	private alignVerticalArrows():void {
		this._heightArrows.setW(this.h);
		this._heightArrows.x = this.w - this._heightArrows.h - 30;
		this._heightArrows.y = Math.floor(this.h);
		this._heightArrows.setText("100% (" + this._heightArrows.w + "px)")
	}

	private alignDetail():void {
		this._detail.setSize(Math.floor(this.w * .3), 150);
		this._detail.x = Math.floor((this.w - this._detail.w) / 2);
		this._detail.y = Math.floor((this.h - this._detail.h) / 2);
	}
}