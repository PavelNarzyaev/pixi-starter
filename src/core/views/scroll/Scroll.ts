import ScrollAbstract from "./ScrollAbstract";
import SliderAbstractV from "./sliders/SliderAbstractV";
import SliderV from "./sliders/SliderV";
import SliderAbstractH from "./sliders/SliderAbstractH";
import SliderH from "./sliders/SliderH";

export default class Scroll extends ScrollAbstract {
	protected verticalSliderFactory():SliderAbstractV {
		return new SliderV();
	}

	protected horizontalSliderFactory():SliderAbstractH {
		return new SliderH();
	}
}