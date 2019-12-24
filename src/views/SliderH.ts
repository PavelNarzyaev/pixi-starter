import View from "../core/views/View";
import SliderAbstractH from "../core/views/slider/SliderAbstractH";
import InteractiveView from "../core/views/InteractiveView";

export default class SliderH extends SliderAbstractH {
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