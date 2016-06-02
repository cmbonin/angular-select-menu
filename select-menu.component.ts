/**
 * Custom dropdown component
 * Sends event to parent on selection of item
 * 
 * @dependency: https://github.com/cmbonin/angular-pipes/tree/master/object-iterable
 */
import {Component, EventEmitter, Input, ElementRef, Inject} from "angular2/core";
import {ObjectIterable} from "../../pipes/object-iterable.pipe";

@Component({
	selector: 'select-menu',
	templateUrl: 'app/components/select-menu/select-menu.component.html',
	styleUrls: ['app/components/select-menu/select-menu.component.css'],
	outputs: ['selected'],
	inputs: ['data', 'dropdowntitle', 'isMulti'],
	pipes: [ObjectIterable]
})

export class SelectMenuComponent {
	selected = new EventEmitter();
	componentClass = 'dropdown-select';
	componentModalClass = 'dropdown-select-modal';
	selectionTitle: String;
	localElementRef: ElementRef;

	constructor( @Inject(ElementRef) elementRef: ElementRef) {
		this.localElementRef = elementRef;
	}
	
	/**
	 * Emits the selection event to parent component
	 * 
	 * @param Event e Click event
	 * @param String value The selected item's value
	 * 
	 */
	onSelect(e, value) {
		this.selected.emit(value);
		this.closeMenu();
		this.deactivateAllMenuItems();
		e.target.parentNode.classList.add('active');
		this.selectionTitle = value;
		e.stopPropagation();
	}

	/**
	 * Removes active calss from all menu items
	 */
	deactivateAllMenuItems() {
		let $dropdown = this.getDropDownElement(),
				$activeItems = $dropdown.querySelectorAll('.active'),
				activeItemCount = $activeItems.length;

		for (var i = 0; i < activeItemCount; i++) {
			$activeItems[i].classList.remove('active');
		}		
	}

	/**
	 * Toggles the sub menu visibility
	 * 
	 * @param Event e Click event
	 */
	subMenuToggle(e) {
		let $target = e.target,
				$dropdown = this.getDropDownElement(),
				$parent = $target.parentNode,
				isOpen = ($parent.classList.contains('open')) ? true : false,
				$allChildItems = $dropdown.querySelector('ul').children,
				menuCount = $allChildItems.length,
				$item;

		for (var i = 0;i<menuCount;i++) {
			$item = $allChildItems[i];
			$item.classList.remove('open');
			$item.classList.remove('active');
		}

		if (!isOpen) {
			$parent.classList.add('open');
			$parent.classList.add('active');
		}

	}

	/**
	 * Toggle the visible status of the menu
	 */
	toggleMenu() {
		let $dropdown = this.getDropDownElement(),
				$topMenu = $dropdown.querySelector('.select-menu'),
				isOpen = ($dropdown.classList.contains('open')) ? true : false,
				$allSubMenus = $dropdown.querySelectorAll('.select-menu-parent'),
				menuCount = $allSubMenus.length,
				$modal,
				self = this;

		for (var i = 0; i < menuCount; i++) {
			$allSubMenus[i].classList.remove('open');
		}

		$dropdown.classList.toggle('open');
		$topMenu.classList.toggle('open');

		if (!isOpen) {
			// add modal for blurring
			$modal = document.createElement('div');
			$modal.className = this.componentModalClass;
			$modal.style.cssText = 'position: fixed;z-index: 1;left: 0;right: 0;top: 0;bottom: 0;';
			document.body.appendChild($modal);
			$modal.addEventListener('click', function() {
				self.closeMenu.call(self);
			});
		}
	}

	/**
	 * Closes the dropdown menu & removes modal
	 */
	closeMenu() {
		let $dropdown = this.getDropDownElement(),
				$modal = document.querySelector('.' + this.componentModalClass),
				menuCount = $dropdown.length;

		//remove modal overlay
		if ($modal) {
			$modal.remove();	
		}

		$dropdown.classList.remove('open');
	}
	
	resetSelection(e) {
		this.resetComponent();
		if (e) {
			e.stopPropagation();
		}
	}

	/**
	 * Resets the component
	 * & emits empty value to parent component
	 */
	resetComponent() {
		this.selected.emit('');
		this.selectionTitle = undefined;
		this.deactivateAllMenuItems();

	}

	/**
	 * Fetches a DOM reference to the dropdown menu
	 */
	getDropDownElement() {
		let $component = this.localElementRef.nativeElement,
				$dropdown = $component.querySelector('.' + this.componentClass);

		if ($dropdown) {
			return $dropdown;
		}
	}
}