import BlockContent from "../BlockContent";
import IInteractiveViewState from "../../../interfaces/IInteractiveViewState";

export default class StatesBlockContent extends BlockContent {
	private _currentState:symbol;

	constructor(states:IInteractiveViewState[]) {
		super();
		states.forEach((state:IInteractiveViewState) => {
			this.createField(state.name, state.symbol);
		});
	}

	public setState(state:symbol):void {
		if (this._currentState) {
			this.getFieldByKey(this._currentState).style.fill = this.getDefaultFill();
		}
		this._currentState = state;
		this.getFieldByKey(this._currentState).style.fill = this.getActiveFill();
	}
}