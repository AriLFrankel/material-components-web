/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCComponent from '@material/base/component';
import {MDCRipple} from '@material/ripple';

import {cssClasses, strings} from './constants';
import MDCTextfieldAdapter from './adapter';
import MDCTextfieldFoundation from './foundation';
import {MDCTextfieldInput} from './input';
import {MDCTextfieldLabel} from './label';
import {MDCTextfieldBottomLine} from './bottom-line';
import {MDCTextfieldHelpText} from './help-text';

/**
 * @extends {MDCComponent<!MDCTextfieldFoundation>}
 * @final
 */
class MDCTextfield extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?MDCTextfieldInput} */
    this.input_;
    /** @private {?MDCTextfieldLabel} */
    this.label_;
    /** @type {?MDCTextfieldHelpText} */
    this.helpText_;
    /** @type {?MDCRipple} */
    this.ripple;
    /** @private {?MDCTextfieldBottomLine} */
    this.bottomLine_;
    /** @private {?Element} */
    this.icon_;
  }

  /**
   * @param {!Element} root
   * @return {!MDCTextfield}
   */
  static attachTo(root) {
    return new MDCTextfield(root);
  }

  /**
   * @param {(function(!Element): !MDCRipple)=} rippleFactory A function which
   * creates a new MDCRipple.
   */
  initialize(rippleFactory = (el) => new MDCRipple(el)) {
    const inputElement = this.root_.querySelector(strings.INPUT_SELECTOR);
    this.input_ = new MDCTextfieldInput(inputElement);
    const labelElement = this.root_.querySelector(strings.LABEL_SELECTOR)
    this.label_ = new MDCTextfieldLabel(labelElement);
    if (inputElement.hasAttribute('aria-controls')) {
      const helpTextElement = document.getElementById(inputElement.getAttribute('aria-controls'));
      if (helpTextElement) {
        this.helpText_ = new MDCTextfieldHelpText(helpTextElement);
      }
    }
    this.ripple = null;
    if (this.root_.classList.contains(cssClasses.BOX)) {
      this.ripple = rippleFactory(this.root_);
    };
    if (!this.root_.classList.contains(cssClasses.TEXTAREA)) {
      const bottomLinElement = this.root_.querySelector(strings.BOTTOM_LINE_SELECTOR);
      this.bottomLine_ = new MDCTextfieldBottomLine(bottomLinElement);
    };
    if (!this.root_.classList.contains(cssClasses.TEXT_FIELD_ICON)) {
      this.icon_ = this.root_.querySelector(strings.ICON_SELECTOR);
    };
  }

  destroy() {
    if (this.input_) {
      this.input_.destroy();
    }
    if (this.label_) {
      this.label_.destroy();
    }
    if (this.bottomLine_) {
      this.bottomLine_.destroy();
    }
    if (this.helpText_) {
      this.helpText_.destroy();
    }
    if (this.ripple) {
      this.ripple.destroy();
    }
    super.destroy();
  }

  /**
   * @return {boolean} True if the Textfield is disabled.
   */
  get disabled() {
    return this.input_.foundation.isDisabled();
  }

  /**
   * @param {boolean} disabled Sets the Textfield disabled or enabled.
   */
  set disabled(disabled) {
    this.foundation_.setDisabled(disabled);
  }

  /**
   * @param {boolean} valid Sets the Textfield valid or invalid.
   */
  set valid(valid) {
    this.foundation_.setValid(valid);
  }

  /**
   * @return {!MDCTextfieldFoundation}
   */
  getDefaultFoundation() {
    return new MDCTextfieldFoundation(/** @type {!MDCTextfieldAdapter} */ (Object.assign({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      eventTargetHasClass: (target, className) => target.classList.contains(className),
      registerTextFieldInteractionHandler: (evtType, handler) => this.root_.addEventListener(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType, handler) => this.root_.removeEventListener(evtType, handler),
      notifyIconAction: () => this.emit(MDCTextfieldFoundation.strings.ICON_EVENT, {}),
      registerInputInteractionHandler: (evtType, handler) => this.input_.listen(evtType, handler),
      deregisterInputInteractionHandler: (evtType, handler) => this.input_.listen(evtType, handler),
      getInputFoundation: () => this.input_.foundation,
      getLabelFoundation: () => this.label_.foundation,
      getBottomLineFoundation: () => {
        if (this.bottomLine_) {
          return this.bottomLine_.foundation;
        }
        return null;
      },
      getHelpTextFoundation: () => {
        if (this.helpText_) {
          return this.helpText_.foundation;
        }
        return null;
      },
    },
    this.getIconAdapterMethods_())));
  }

  /**
   * @return {!{
   *   setIconAttr: function(string, string): undefined,
   * }}
   */
  getIconAdapterMethods_() {
    return {
      setIconAttr: (name, value) => {
        if (this.icon_) {
          this.icon_.setAttribute(name, value);
        }
      },
    };
  }
}

export {MDCTextfield, MDCTextfieldFoundation};
