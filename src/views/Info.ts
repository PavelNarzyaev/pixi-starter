import View from "../core/views/View";
import Text = PIXI.Text;
import App from "../App";
import RequestsManager from "../managers/RequestsManager";
import BlockBackground from "./BlockBackground";

export default class Info extends View {
	private _background:BlockBackground;
	private _field:Text;
	private _dirty:boolean = false;

	constructor() {
		super();
		this.init();
	}

	private init():void {
		this.initBackground();
		this.initField();
		App.emitter.addListener(
			RequestsManager.CHANGE_EVENT,
			() => {
				this.markAsDirty();
			},
			this,
		);
	}

	private initBackground():void {
		this._background = new BlockBackground();
		this.addChild(this._background);
	}

	private initField():void {
		this._field = new Text(
			"",
			{
				fontSize: 11,
			});
		this._field.x = this._field.y = 10;
		this.addChild(this._field);
	}

	private markAsDirty():void {
		if (!this._dirty) {
			this._dirty = true;
			requestAnimationFrame(() => {
				this.refreshField();
				this._dirty = false;
			});
		}
	}

	private refreshField():void {
		this._field.text = "Requests: " + RequestsManager.getRequestsCounter() + "\n";
		this._field.text += "Loadings: " + RequestsManager.getLoadingsCounter() + "\n\n";
		const successRequestsCache:Set<string> = RequestsManager.getSuccessRequestsCache();
		if (successRequestsCache) {
			this._field.text += "Cache:\n";
			successRequestsCache.forEach((requestId:string) => {
				this._field.text += "\n";
				this._field.text += requestId;
			});
		}
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
	}

	private alignBackground():void {
		this._background.setSize(this.w, this.h);
	}
}