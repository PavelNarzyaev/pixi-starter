import CommandsGroup from "./CommandsGroup";

export default class CommandsQueue extends CommandsGroup {
	private _resolve:() => void;
	private _reject:() => void;

	protected promiseFactory():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
			this.nextPromise();
		});
	}

	private nextPromise():void {
		this._commands[this._completedCommandsCounter].createPromise()
			.then(() => {
				this._completedCommandsCounter++;
				if (this._completedCommandsCounter < this._commands.length) {
					this.nextPromise();
				} else {
					this._resolve();
				}
			})
			.catch(() => {
				this._reject();
			});
	}
}