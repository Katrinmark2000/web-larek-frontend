import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";

export class Contact extends Form<IOrderForm> {
    protected _inputPhoneNumber: HTMLInputElement;
    protected _inputEmail: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._inputPhoneNumber = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        this._inputEmail = this.container.querySelector('input[name="email"]') as HTMLInputElement;
    }

    set phone(value: string) {
        this._inputPhoneNumber.value = value;
    }

    set email(value: string) {
        this._inputEmail.value = value;
    }
}