import IListener from "../../../interfaces/IListener";
import Text = PIXI.Text;
import BlockContent from "../BlockContent";
import IListenerState from "../../../interfaces/IListenerState";

export default class ListenersBlockContent extends BlockContent {
	private _fieldById:Map<number, Text> = new Map<number, Text>();

	constructor(listeners:IListener[]) {
		super();
		listeners.forEach((listener:IListener) => {
			this._fieldById.set(listener.id, this.createField(listener.name));
		});
	}

	public refreshStates(states:IListenerState[]):void {
		states.forEach((state:IListenerState) => {
			this.fillField(this._fieldById.get(state.id), state.added);
		});
	}
}