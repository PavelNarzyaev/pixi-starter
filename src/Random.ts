export function genRandomInteger(min:number, max:number):number {
	return min + Math.floor(Math.random() * (max - min + 1));
}

export function genRandomColor():number {
	return Math.floor(Math.random() * 0x1000000);
}