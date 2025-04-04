import { IProductActions, IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export class Product extends Component<IProduct> {
	protected _id: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = container.querySelector('.card__price');
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, `Бесценно`);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}

		if (this._button && value === null) {
			this._button.disabled = true;
		}
	}

	set buttonText(value: string) {
		this._button.textContent = value;
	}
}