import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

//Интерфейс о состоянии всей страницы
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
  }

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLButtonElement;
	protected _locked: boolean;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLButtonElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}
	set counter (value: number) {
        this.setText(this._counter, value); // Установка текста счетчика
    }

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

    // Установка состояния блокировки страницы
    set locked(value: boolean) {
        this._wrapper.classList.toggle('page__wrapper_locked', value);
    }
}