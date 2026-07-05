import type { VisualElementOverride } from '../context/SiteEditorContext';

const EDITABLE_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'BUTTON', 'LI', 'LABEL']);

export const INLINE_EDITOR_UI_SELECTOR = '[data-inline-editor-ui="true"]';

export const isEditableElement = (element: HTMLElement | null) => {
  if (!element) {
    return false;
  }

  if (!EDITABLE_TAGS.has(element.tagName)) {
    return false;
  }

  if (element.closest(INLINE_EDITOR_UI_SELECTOR)) {
    return false;
  }

  const text = element.textContent?.trim() || '';
  return text.length > 0;
};

export const buildElementSelector = (element: HTMLElement) => {
  const chain: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    const parent = current.parentElement;
    if (!parent) {
      break;
    }

    const siblings = Array.from(parent.children).filter((child) => child.tagName === current!.tagName);
    const index = siblings.indexOf(current) + 1;
    chain.unshift(`${current.tagName.toLowerCase()}:nth-of-type(${index})`);
    current = parent;
  }

  return `body > ${chain.join(' > ')}`;
};

export const applyOverrideToElement = (element: HTMLElement, override: VisualElementOverride) => {
  rememberOriginalState(element);

  if (override.text !== undefined) {
    element.textContent = override.text;
  }

  element.style.color = override.color || '';
  element.style.fontSize = override.fontSize || '';
  element.style.fontWeight = override.fontWeight || '';
  element.style.fontStyle = override.fontStyle || '';
  element.style.letterSpacing = override.letterSpacing || '';
  element.style.textTransform = override.textTransform || '';
};

export const applyOverridesToDocument = (overrides: Record<string, VisualElementOverride>) => {
  Object.entries(overrides).forEach(([selector, override]) => {
    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      element.dataset.inlineEditorSelector = selector;
      applyOverrideToElement(element, override);
    }
  });
};

export const syncOverridesInDocument = (overrides: Record<string, VisualElementOverride>) => {
  document.querySelectorAll<HTMLElement>('[data-inline-editor-selector]').forEach((element) => {
    const selector = element.dataset.inlineEditorSelector;
    if (!selector || overrides[selector]) {
      return;
    }

    resetElementToOriginal(element);
    delete element.dataset.inlineEditorSelector;
  });

  applyOverridesToDocument(overrides);
};

export const readElementSnapshot = (element: HTMLElement, selector: string) => {
  const computed = window.getComputedStyle(element);

  return {
    selector,
    tagName: element.tagName.toLowerCase(),
    text: element.textContent || '',
    color: toHexColor(computed.color),
    fontSize: `${Math.round(parseFloat(computed.fontSize))}`,
    fontWeight: computed.fontWeight,
    fontStyle: computed.fontStyle,
    letterSpacing: computed.letterSpacing === 'normal' ? '0' : `${Math.round(parseFloat(computed.letterSpacing))}`,
    textTransform: computed.textTransform === 'none' ? 'none' : computed.textTransform,
  };
};

const toHexColor = (rgb: string) => {
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) {
    return '#111111';
  }

  const [r, g, b] = match.slice(0, 3).map((value) => Number.parseInt(value, 10));
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
};

const rememberOriginalState = (element: HTMLElement) => {
  if (!element.dataset.inlineEditorOriginalText) {
    element.dataset.inlineEditorOriginalText = element.textContent || '';
  }

  if (!element.dataset.inlineEditorOriginalColor) {
    element.dataset.inlineEditorOriginalColor = element.style.color || '';
  }

  if (!element.dataset.inlineEditorOriginalFontSize) {
    element.dataset.inlineEditorOriginalFontSize = element.style.fontSize || '';
  }

  if (!element.dataset.inlineEditorOriginalFontWeight) {
    element.dataset.inlineEditorOriginalFontWeight = element.style.fontWeight || '';
  }

  if (!element.dataset.inlineEditorOriginalFontStyle) {
    element.dataset.inlineEditorOriginalFontStyle = element.style.fontStyle || '';
  }

  if (!element.dataset.inlineEditorOriginalLetterSpacing) {
    element.dataset.inlineEditorOriginalLetterSpacing = element.style.letterSpacing || '';
  }

  if (!element.dataset.inlineEditorOriginalTextTransform) {
    element.dataset.inlineEditorOriginalTextTransform = element.style.textTransform || '';
  }
};

const resetElementToOriginal = (element: HTMLElement) => {
  if (element.dataset.inlineEditorOriginalText !== undefined) {
    element.textContent = element.dataset.inlineEditorOriginalText;
  }

  element.style.color = element.dataset.inlineEditorOriginalColor || '';
  element.style.fontSize = element.dataset.inlineEditorOriginalFontSize || '';
  element.style.fontWeight = element.dataset.inlineEditorOriginalFontWeight || '';
  element.style.fontStyle = element.dataset.inlineEditorOriginalFontStyle || '';
  element.style.letterSpacing = element.dataset.inlineEditorOriginalLetterSpacing || '';
  element.style.textTransform = element.dataset.inlineEditorOriginalTextTransform || '';
};
