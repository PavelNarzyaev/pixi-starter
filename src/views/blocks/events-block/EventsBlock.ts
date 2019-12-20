import Block from "../Block";
import EventsBlockContent from "./EventsBlockContent";
import IEvent from "../../../interfaces/IEvent";

export default class EventsBlock extends Block {
	constructor(events:IEvent[]) {
		super("Events");
		this.setContent(new EventsBlockContent(events));
	}

	public getContent():EventsBlockContent {
		return super.getContent() as EventsBlockContent;
	}
}