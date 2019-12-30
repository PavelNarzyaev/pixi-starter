import View from "../core/views/View";
import Button from "./Button";
import InteractiveView from "../core/views/InteractiveView";
import Info from "./Info";
import TilingSprite = PIXI.TilingSprite;
import Texture = PIXI.Texture;
import RadioButtons from "./RadioButtons";

export default class MainContent extends View {
	private static readonly RADIO_NAMES:string[] = ["One", "Two", "Three"];

	private _background:TilingSprite;
	private _button:Button;
	private _selectableButton:Button;
	private _radioButtons:RadioButtons;
	private _info:Info;
	private _elements:View[] = [];

	private _clicksCounter:number = 0;

	constructor() {
		super();

		this._background = this.addChild(new TilingSprite(Texture.from("img/background.png")));
		this._button = this.initElement(new Button("Button"));
		this._selectableButton = this.initElement(new Button("Selectable", true));
		this._radioButtons = this.initElement(new RadioButtons(MainContent.RADIO_NAMES));
		this._radioButtons.select(0);
		this._info = this.initElement(new Info());
		this.refreshClicks();
		this.refreshSelected();
		this.refreshItem();
		this._button.addListener(
			InteractiveView.CLICK,
			() => {
				this._clicksCounter++;
				this.refreshClicks();
			}
		);
		this._selectableButton.addListener(
			InteractiveView.CHANGE_SELECT,
			() => {
				this.refreshSelected();
			}
		);
		this._radioButtons.addListener(
			RadioButtons.CHANGE,
			() => {
				this.refreshItem();
			}
		);
	}

	private refreshClicks():void {
		this._info.setClicks(this._clicksCounter);
	}

	private refreshSelected():void {
		this._info.setSelected(this._selectableButton.getSelected());
	}

	private refreshItem():void {
		this._info.setItem(MainContent.RADIO_NAMES[this._radioButtons.getSelectedIndex()]);
	}

	private initElement<T extends View>(element:T):T {
		this._elements.push(element);
		return this.addChild(element);
	}

	protected applySize():void {
		super.applySize();

		this._background.width = this.w;
		this._background.height = this.h;
		this._button.setSize(150, 50);
		this._selectableButton.setSize(200, 50);
		this._radioButtons.setSize(400, 50);
		this._info.setSize(400, 200);

		const gap:number = 10;
		let elementsHeight:number = 0;
		this._elements.forEach((element:View) => {
			if (elementsHeight) {
				elementsHeight += gap;
			}
			elementsHeight += element.h;
		});
		let nextY:number = Math.floor((this.h - elementsHeight) / 2);
		this._elements.forEach((element:View) => {
			this.centerHorizontal(element);
			element.y = nextY;
			nextY += element.h + gap;
		});
	}
}