import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";

export class Order extends Form<Partial<IOrderForm>> {
    protected _paymentCashButton: HTMLButtonElement;
    protected _paymentCardButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Инициализация элементов формы
        this._paymentCashButton = container.querySelector<HTMLButtonElement>('button[name="cash"]');
        this._paymentCardButton = container.querySelector<HTMLButtonElement>('button[name="card"]');
        this._addressInput = container.querySelector<HTMLInputElement>('input[name="address"]') as HTMLInputElement;

        // Установка обработчиков событий для кнопок оплаты
        this.setupPaymentButtonListeners();
    }

    protected setupPaymentButtonListeners() {
        this._paymentCashButton.addEventListener('click', () => {
            this.setPaymentMethod('cash');
            this.onInputChange('payment', 'card');
        });
        this._paymentCardButton.addEventListener('click', () => {
            this.setPaymentMethod('card');
            this.onInputChange('payment', 'card');
        });
        
    }
    
    protected setPaymentMethod(method: 'cash' | 'card') {
        this._paymentCardButton.classList.toggle('button_alt-active', method === 'card');
        this._paymentCashButton.classList.toggle('button_alt-active', method === 'cash');
}

    set address(value: string) {
		this._addressInput.value = value;
	}

    
}
