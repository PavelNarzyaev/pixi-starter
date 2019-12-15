// FIXME: temporary code
import RequestsManager from "../../managers/RequestsManager";

export default class AbstractRequest {
	private static readonly _successRequestsIds:Set<string> = new Set<string>();
	private static readonly _executingPromiseByRequestId:Map<string, Promise<void>> = new Map<string, Promise<void>>();

	private _requestId:string;

	protected createRequestId():string {
		return  null;
	}

	protected createUrl():string {
		return  null;
	}

	public createPromise():Promise<void> {
		this._requestId = this.createRequestId();
		if (this._requestId !== null) {
			RequestsManager.request();
			if (AbstractRequest._successRequestsIds.has(this._requestId)) {
				return this.createEmptyPromise();
			} else {
				const executingPromise:Promise<void> = AbstractRequest._executingPromiseByRequestId.get(this._requestId);
				if (executingPromise) {
					return this.createWaitPromise(executingPromise);
				} else {
					return this.createUniqueRequestPromise();
				}
			}
		} else {
			return this.requestPromiseFactory();
		}
	}

	private createEmptyPromise():Promise<void> {
		return new Promise<void>((resolve) => {
			resolve();
		});
	}

	private createWaitPromise(executingPromise:Promise<void>):Promise<void> {
		return new Promise<void>((resolve, reject) => {
			executingPromise
				.then(() => resolve())
				.catch(() => reject());
		});
	}

	private createUniqueRequestPromise():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			RequestsManager.loading();
			const uniquePromise:Promise<void> = this.requestPromiseFactory();
			AbstractRequest._executingPromiseByRequestId.set(this._requestId, uniquePromise);
			uniquePromise
				.then(() => {
					AbstractRequest._executingPromiseByRequestId.delete(this._requestId);
					AbstractRequest._successRequestsIds.add(this._requestId);
					RequestsManager.refreshSuccessRequestsCache(AbstractRequest._successRequestsIds);
					resolve();
				})
				.catch(() => {
					AbstractRequest._executingPromiseByRequestId.delete(this._requestId);
					reject();
				});
		});
	}

	protected requestPromiseFactory():Promise<void> {
		return null;
	}
}