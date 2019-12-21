import BlockContent from "../BlockContent";
import IEvent from "../../../interfaces/IEvent";
import Text = PIXI.Text;
import App from "../../../App";
import Color from "../../../Color";

export default class EventsBlockContent extends BlockContent {
	private static readonly ANIMATION_TIME:number = 30;
	private _fieldByEvent:Map<symbol, Text> = new Map<symbol, Text>();
	private _tickByField:Map<Text, number> = new Map<Text, number>();
	private _colorByField:Map<Text, Color> = new Map<Text, Color>();
	private _defaultFillColor:Color;

	constructor(events:IEvent[]) {
		super(null, 0x0000ff);
		this._defaultFillColor = new Color(this.getDefaultFill());
		events.forEach((event:IEvent) => {
			this._fieldByEvent.set(event.symbol, this.createField(event.name));
		});
	}

	public eventHandler(event:symbol):void {
		const field:Text = this._fieldByEvent.get(event);
		this._tickByField.set(field, EventsBlockContent.ANIMATION_TIME);
		const color:Color = new Color(this.getActiveFill());
		this._colorByField.set(field, color);
		field.style.fill = color.calculateColor();
		if (this._tickByField.size == 1) {
			App.pixi.ticker.add(this.tick, this);
		}
	}

	private tick():void {
		this._tickByField.forEach((tick:number, field:Text) => {
			tick -= 1;
			if (tick == 0) {
				field.style.fill = this.getDefaultFill();
				this._tickByField.delete(field);
			} else {
				const color:Color = this._colorByField.get(field);
				color.red = this.calculateColorPart(color.red, this._defaultFillColor.red, tick);
				color.green = this.calculateColorPart(color.green, this._defaultFillColor.green, tick);
				color.blue = this.calculateColorPart(color.blue, this._defaultFillColor.blue, tick);
				field.style.fill = color.calculateColor();
				this._tickByField.set(field, tick);
			}
		});
		if (this._tickByField.size == 0) {
			App.pixi.ticker.remove(this.tick, this);
		}
	}

	private calculateColorPart(currentColor:number, targetColor:number, tick:number):number {
		return currentColor - Math.floor((currentColor - targetColor) / tick);
	}
}