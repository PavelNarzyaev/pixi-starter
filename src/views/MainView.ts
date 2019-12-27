import View from "../core/views/View";
import TilingSprite = PIXI.TilingSprite;
import Texture = PIXI.Texture;
import Scroll from "./scroll/Scroll";
import MainContent from "./MainContent";
import {genRandomInteger} from "../Random";
import {POINTER_DOWN} from "../PointerEvents";

export default class MainView extends View {
	private _background:TilingSprite;
	private _scroll:Scroll;
	private _mainContent:MainContent;

	constructor() {
		super();

		this._background = this.addChild(new TilingSprite(Texture.from("img/background.png"), 100, 100));
		this._scroll = this.addChild(new Scroll(true));
		this._mainContent = this._scroll.addContent(new MainContent());

		// FIXME: <temporary_code>
		this._mainContent.setSize(1000, 1000);
		/*
		this._mainContent.showTestBackground();
		this._background.interactive = true;
		this._background.on(POINTER_DOWN, () => {
			this._mainContent.setSize(genRandomInteger(500, 1500), genRandomInteger(500, 1500), true);
			console.log(this._mainContent.getStringSize());
		}, this);
		 */
		// FIXME: </temporary_code>
	}

	protected applySize():void {
		super.applySize();

		this._background.width = this.w;
		this._background.height = this.h;
		// this._mainContent.setSize(1000, 1000); // FIXME
		this._scroll.setSize(this.w, this.h);
	}
}