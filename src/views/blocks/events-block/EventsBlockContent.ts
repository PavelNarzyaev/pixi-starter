import BlockContent from "../BlockContent";
import IEvent from "../../../interfaces/IEvent";
import Text = PIXI.Text;

export default class EventsBlockContent extends BlockContent {
	private _fieldByEvent:Map<symbol, Text> = new Map<symbol, Text>();
	private _timerByEvent:Map<symbol, number> = new Map<symbol, number>();

	constructor(events:IEvent[]) {
		super(null, 0x0000ff);
		events.forEach((event:IEvent) => {
			this._fieldByEvent.set(event.symbol, this.createField(event.name));
		});
	}

	public eventHandler(event:symbol):void {
		if (this._timerByEvent.has(event)) {
			window.clearTimeout(this._timerByEvent.get(event));
		} else {
			this._fieldByEvent.get(event).style.fill = this.getActiveFill();
		}
		this._timerByEvent.set(
			event,
			window.setTimeout(() => {
				this._timerByEvent.delete(event);
				this._fieldByEvent.get(event).style.fill = this.getDefaultFill();
			},
			250)
		);
	}
}