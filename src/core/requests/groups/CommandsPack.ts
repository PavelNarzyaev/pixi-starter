import CommandsGroup from "./CommandsGroup";
import Command from "../Command";

export default class CommandsPack extends CommandsGroup {
	private _hasErrors:boolean = false;

	protected promiseFactory():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._commands.forEach((command:Command) => {
				command.createPromise()
					.catch(() => {
						this._hasErrors = true;
					})
					.finally(() => {
						this._completedCommandsCounter++;
						if (this._completedCommandsCounter == this._commands.length) {
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