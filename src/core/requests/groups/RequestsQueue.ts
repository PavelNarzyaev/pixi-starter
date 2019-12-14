import RequestsGroup from "./RequestsGroup";

export default class RequestsQueue extends RequestsGroup {
	private _resolve:() => void;
	private _reject:() => void;

	protected requestPromiseFactory():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
			this.nextRequest();
		});
	}

	private nextRequest():void {
		this._requests[this._completedRequestsCounter].createPromise()
			.then(() => {
				this._completedRequestsCounter++;
				if (this._completedRequestsCounter < this._requests.length) {
					this.nextRequest();
				} else {
					this._resolve();
				}
			})
			.catch(() => {
				this._reject();
			});
	}
}