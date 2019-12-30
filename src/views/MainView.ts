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

		this._mainContent.setSize(Math.max(1000, this.w), Math.max(1000, this.h));
		this._scroll.setSize(this.w, this.h);
	}
}