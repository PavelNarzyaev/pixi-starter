export default class Color {
	public red:number = 0;
	public green:number = 0;
	public blue:number = 0;

	constructor(color:number = null) {
		if (color !== null) {
			this.red = Math.floor(color / (256 * 256));
			this.green = Math.floor(color / 256) % 256;
			this.blue = color % 256;
		}
	}

	public calculateColor():number {
		return this.red * (256 * 256) + this.green * 256 + this.blue;
	}
}