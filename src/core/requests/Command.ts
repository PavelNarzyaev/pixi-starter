export default class Command {
	private static readonly _successIds:Set<string> = new Set<string>();
	private static readonly _executingCommandById:Map<string, Promise<void>> = new Map<string, Promise<void>>();

	private _commandId:string;

	protected createCommandId():string {
		return  null;
	}

	public createPromise():Promise<void> {
		this._commandId = this.createCommandId();
		if (this._commandId !== null) {
			if (Command._successIds.has(this._commandId)) {
				return this.createEmptyPromise();
			} else {
				const executingPromise:Promise<void> = Command._executingCommandById.get(this._commandId);
				if (executingPromise) {
					return this.createWaitPromise(executingPromise);
				} else {
					return this.createUniquePromise();
				}
			}
		} else {
			return this.promiseFactory();
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

	private createUniquePromise():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const uniquePromise:Promise<void> = this.promiseFactory();
			Command._executingCommandById.set(this._commandId, uniquePromise);
			uniquePromise
				.then(() => {
					Command._executingCommandById.delete(this._commandId);
					Command._successIds.add(this._commandId);
					resolve();
				})
				.catch(() => {
					Command._executingCommandById.delete(this._commandId);
					reject();
				});
		});
	}

	protected promiseFactory():Promise<void> {
		return null;
	}
}