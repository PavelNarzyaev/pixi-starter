import BlockContent from "../BlockContent";
import IEvent from "../../../interfaces/IEvent";
import Text = PIXI.Text;

export default class EventsBlockContent extends BlockContent {
	private _fieldByEvent:Map<symbol, Text> = new Map<symbol, Text>();
	private _timerByEvent:Map<symbol, number> = new Map<symbol, number>();

	constructor(events:IEvent[]) {
		super();
		events.forEach((event:IEvent) => {
			this._fieldByEvent.set(event.symbol, this.createField(event.name));
		});
	}

	public eventHandler(event:symbol):void {
		if (this._timerByEvent.has(event)) {
			window.clearTimeout(this._timerByEvent.get(event));
		} else {
			this.fillField(this._fieldByEvent.get(event), true);
		}
		this._timerByEvent.set(
			event,
			window.setTimeout(() => {
				this._timerByEvent.delete(event);
				this.fillField(this._fieldByEvent.get(event), false);
			},
			500)
		);
	}
}