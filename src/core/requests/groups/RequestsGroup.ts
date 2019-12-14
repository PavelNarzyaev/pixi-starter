import AbstractRequest from "../AbstractRequest";

export default class RequestsGroup extends AbstractRequest {
	protected _requests:AbstractRequest[];
	protected _completedRequestsCounter:number = 0;

	constructor(...requests:AbstractRequest[]) {
		super();
		this._requests = requests;
	}
}