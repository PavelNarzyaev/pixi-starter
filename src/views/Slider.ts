import SliderAbstract from "../core/views/SliderAbstract";
import View from "../core/views/View";
import Thumb from "../core/views/Thumb";

export default class Slider extends SliderAbstract {
	protected backgroundFactory():View {
		const background:View = new View();
		background.showTestBackground();
		return background;
	}

	protected thumbFactory():Thumb {
		const thumb:Thumb = new Thumb();
		thumb.showTestBackground();
		return thumb;
	}
}