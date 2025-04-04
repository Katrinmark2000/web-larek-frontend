import {Component} from "../base/Component";
import {createElement, ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";
import {IBasketView, IProductActions} from "../../types";
import { Product } from "./Product";


export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.button');
        // Инициализация массива товаров
        this.list = [];

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }

    set list(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false; // Разблокируем кнопку, если есть элементы
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this._button.disabled = true; // Блокируем кнопку, если корзина пуста
        }
    }

    set selected(items: string[]) {
        this.setDisabled(this._button, items.length === 0);
    }

    set total(total: number) {
        this.setText(this._total, total.toString() + ' синапсов');
    }
    
}

export class BasketProduct extends Product {
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container, actions);

		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._button = ensureElement<HTMLButtonElement>(
`.basket__item-delete`, container);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}