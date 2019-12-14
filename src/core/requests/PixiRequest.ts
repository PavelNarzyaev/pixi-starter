import AbstractRequest from "./AbstractRequest";
import Loader = PIXI.Loader;

export default class PixiRequest extends AbstractRequest {
	constructor(
		private _url:string,
	) {
		super();
	}

	protected createRequestId():string {
		return "PixiRequest::" + this._url;
	}

	protected requestPromiseFactory():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const loader:Loader = new Loader();
			loader.add(this._url, this._url);
			loader.onLoad.add(() => { resolve(); });
			loader.onError.add(() => { reject(); });
			loader.load();
		});
	}
}