import Block from "../Block";
import StatesBlockContent from "./StatesBlockContent";
import IInteractiveViewState from "../../../interfaces/IInteractiveViewState";

export default class StatesBlock extends Block {
	constructor(states:IInteractiveViewState[]) {
		super("States");
		this.setContent(new StatesBlockContent(states));
	}

	getContent():StatesBlockContent {
		return super.getContent() as StatesBlockContent;
	}
}