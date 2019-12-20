import Block from "../Block";
import IListener from "../../../interfaces/IListener";
import ListenersBlockContent from "./ListenersBlockContent";

export default class ListenersBlock extends Block {
	public dirty:boolean = false;

	constructor(listeners:IListener[]) {
		super("Event listeners");
		this.setContent(new ListenersBlockContent(listeners));
	}

	public getContent():ListenersBlockContent {
		return super.getContent() as ListenersBlockContent;
	}
}