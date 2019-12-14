import AbstractRequest from "../AbstractRequest";
import RequestsGroup from "./RequestsGroup";

export default class RequestsPack extends RequestsGroup {
	private _hasErrors:boolean = false;

	protected requestPromiseFactory():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._requests.forEach((request:AbstractRequest) => {
				request.createPromise()
					.catch(() => {
						this._hasErrors = true;
					})
					.finally(() => {
						this._completedRequestsCounter++;
						if (this._completedRequestsCounter == this._requests.length) {
							if (!this._hasErrors) {
								resolve();
							} else {
								reject();
							}
						}
					});
			});
		});
	}
}