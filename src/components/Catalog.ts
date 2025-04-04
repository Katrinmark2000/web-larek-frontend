import { ensureElement } from '../utils/utils';
import { IProductActions } from '../types/index';
import { Product } from '../components/common/Product';

export class ProductCatalog extends Product {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _categoryColor = new Map<string, string>([
		['софт-скил', '_soft'],
		['хард-скил', '_hard'],
        ['другое', '_other'],
		['кнопка', '_button'],
		['дополнительное', '_additional'],
	]);

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container, actions);

		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category?.classList?.remove('card__category_soft');
		this._category?.classList?.remove('card__category_other');
		this._category?.classList?.add(
			`card__category${this._categoryColor.get(value)}`
		);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
}