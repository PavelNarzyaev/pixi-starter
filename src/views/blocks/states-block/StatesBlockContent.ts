import BlockContent from "../BlockContent";
import IInteractiveViewState from "../../../interfaces/IInteractiveViewState";
import Text = PIXI.Text;

export default class StatesBlockContent extends BlockContent {
	private _fieldBySymbol:Map<symbol, Text> = new Map<symbol, Text>();
	private _currentState:symbol;

	constructor(states:IInteractiveViewState[]) {
		super();
		states.forEach((state:IInteractiveViewState) => {
			this._fieldBySymbol.set(state.symbol, this.createField(state.name));
		});
	}

	public setState(state:symbol):void {
		if (this._currentState) {
			this.fillField(this._fieldBySymbol.get(this._currentState), false);
		}
		this._currentState = state;
		this.fillField(this._fieldBySymbol.get(this._currentState), true);
	}
}