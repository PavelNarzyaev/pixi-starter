import View from "../core/views/View";
import Scroll from "./scroll/Scroll";
import MainContent from "./MainContent";

export default class MainView extends View {
	private _scroll:Scroll;
	private _mainContent:MainContent;

	constructor() {
		super();

		this._scroll = this.addChild(new Scroll(true));
		this._mainContent = this._scroll.addContent(new MainContent());
	}

	protected applySize():void {
		super.applySize();

		const scrollMargin:number = 50;
		const scrollWidth:number = this.w - scrollMargin * 2;
		const scrollHeight:number = this.h - scrollMargin * 2;
		this._mainContent.setSize(Math.max(1200, scrollWidth), Math.max(700, scrollHeight));
		this._scroll.setSize(scrollWidth, scrollHeight);
		this.center(this._scroll);
	}
}