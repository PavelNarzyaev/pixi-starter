import View from "../core/views/View";
import SliderAbstractV from "../core/views/slider/SliderAbstractV";
import InteractiveView from "../core/views/InteractiveView";

export default class SliderV extends SliderAbstractV {
	protected backgroundFactory():View {
		const background:View = new View();
		background.showTestBackground();
		return background;
	}

	protected thumbFactory():InteractiveView {
		const thumb:InteractiveView = new InteractiveView();
		thumb.showTestBackground();
		return thumb;
	}
}