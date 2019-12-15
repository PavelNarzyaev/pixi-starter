import App from "../App";

export default class RequestsManager {
	public static CHANGE_EVENT:symbol = Symbol();

	private static _successRequestsCache:Set<string>;
	private static _requestsCounter:number = 0;
	private static _loadingsCounter:number = 0;

	public static refreshSuccessRequestsCache(value:Set<string>):void {
		RequestsManager._successRequestsCache = value;
		App.emitter.emit(RequestsManager.CHANGE_EVENT);
	}

	public static getSuccessRequestsCache():Set<string> {
		return RequestsManager._successRequestsCache;
	}

	public static request():void {
		RequestsManager._requestsCounter++;
		App.emitter.emit(RequestsManager.CHANGE_EVENT);
	}

	public static getRequestsCounter():number {
		return RequestsManager._requestsCounter;
	}

	public static loading():void {
		RequestsManager._loadingsCounter++;
		App.emitter.emit(RequestsManager.CHANGE_EVENT);
	}

	public static getLoadingsCounter():number {
		return RequestsManager._loadingsCounter;
	}
}