import { ensureElement } from '../utils/utils';
import { IProductActions } from '../types/index';
import { ProductCatalog } from '../components/Catalog';

export class ProductViewDesc extends ProductCatalog {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container, actions);

		this._description = ensureElement<HTMLElement>('.card__text', container);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descriptionTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descriptionTemplate, str);
					return descriptionTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}
}