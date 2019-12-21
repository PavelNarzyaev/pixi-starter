import IListener from "../../../interfaces/IListener";
import BlockContent from "../BlockContent";
import IListenerState from "../../../interfaces/IListenerState";

export default class ListenersBlockContent extends BlockContent {
	constructor(listeners:IListener[]) {
		super();
		listeners.forEach((listener:IListener) => {
			this.createField(listener.name, listener.id);
		});
	}

	public refreshStates(states:IListenerState[]):void {
		states.forEach((state:IListenerState) => {
			this.getFieldByKey(state.id).style.fill = state.added ? this.getActiveFill() : this.getDefaultFill();
		});
	}
}