import AbstractRequest from "./AbstractRequest";
import Loader = PIXI.Loader;

export default class PixiRequest extends AbstractRequest {
	private _url:string;

	constructor() {
		super();
	}

	protected createRequestId():string {
		return "PixiRequest:" + this.createOrGetUrl();
	}

	protected requestPromiseFactory():Promise<void> {
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