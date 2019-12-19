import Request from "./Request";

export default class XhrRequest extends Request {
	private _requestData:object = null;

	protected setRequestData(action:string, value:object = null):void {
		this._requestData = {...{action}, ...value};
	}

	protected promiseFactory():Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const xhr:XMLHttpRequest = new XMLHttpRequest();
			let url:string = this.createUrl();
			if (this._requestData) {
				url += "?" + this.stringifyRequestData(this._requestData);
			}
			xhr.open("GET", url,true);
			xhr.setRequestHeader("Accept", "text/plain");
			xhr.responseType = "json";
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						this.parseResponse(xhr.response);
						resolve();
					} else {
						reject();
					}
				}
			};
			xhr.send();
		});
	}

	protected parseResponse(data:any):void {
	}

	private stringifyRequestData(data:any):string {
		let response:string = "";
		for (const dataKey in data) {
			if (data.hasOwnProperty(dataKey) && data[dataKey] !== undefined) {
				if (response !== "") {
					response += "&";
				}
				let value:string;
				if (typeof data[dataKey] === "object") {
					value = JSON.stringify(data[dataKey]);
				} else {
					value = data[dataKey];
				}
				response += dataKey + "=" + value;
			}
		}
		return response;
	}
}