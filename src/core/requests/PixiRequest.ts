import Loader = PIXI.Loader;
import Request from "./Request";

export default class PixiRequest extends Request {
	private _url:string;

	constructor() {
		super();
	}

	protected createCommandId():string {
		return "PixiRequest:" + this.createOrGetUrl();
	}

	protected promiseFactory():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const loader:Loader = new Loader();
			loader.add(this.createOrGetUrl(), this.createOrGetUrl());
			loader.onLoad.add(() => { resolve(); });
			loader.onError.add(() => { reject(); });
			loader.load();
		});
	}

	private createOrGetUrl():string {
		if (!this._url) {
			this._url = this.createUrl();
		}
		return this._url;
	}
}