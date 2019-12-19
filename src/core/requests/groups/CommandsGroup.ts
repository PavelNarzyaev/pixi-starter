import Command from "../Command";

export default class CommandsGroup extends Command {
	protected _commands:Command[];
	protected _completedCommandsCounter:number = 0;

	constructor(...commands:Command[]) {
		super();
		this._commands = commands;
	}
}