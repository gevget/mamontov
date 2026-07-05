import { useEffect, useMemo, useState } from 'react';
import { Eraser, Focus, Italic, Type } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSiteEditor } from '../context/SiteEditorContext';
import { INLINE_EDITOR_UI_SELECTOR, buildElementSelector, isEditableElement, readElementSnapshot, syncOverridesInDocument } from '../lib/inline-editor';

type SelectedElementState = {
  selector: string;
  tagName: string;
  text: string;
  color: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  letterSpacing: string;
  textTransform: string;
};

type OverlayBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const getOverlayBox = (element: HTMLElement | null): OverlayBox | null => {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
};

export const InlineVisualEditor = () => {
  const location = useLocation();
  const {
    editorEnabled,
    elementOverrides,
    updateElementOverride,
    removeElementOverride,
    resetElementOverrides,
  } = useSiteEditor();
  const [selectedElement, setSelectedElement] = useState<SelectedElementState | null>(null);
  const [hoveredBox, setHoveredBox] = useState<OverlayBox | null>(null);
  const [selectedBox, setSelectedBox] = useState<OverlayBox | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      syncOverridesInDocument(elementOverrides);
    });
  }, [elementOverrides, location.pathname]);

  useEffect(() => {
    if (!editorEnabled) {
      setSelectedElement(null);
      setHoveredBox(null);
      setSelectedBox(null);
      return;
    }

    const updateSelection = (element: HTMLElement | null) => {
      if (!element) {
        setSelectedElement(null);
        setSelectedBox(null);
        return;
      }

      const selector = buildElementSelector(element);
      setSelectedElement(readElementSnapshot(element, selector));
      setSelectedBox(getOverlayBox(element));
    };

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('*') : null;
      const editable = target instanceof HTMLElement && isEditableElement(target) ? target : null;
      setHoveredBox(getOverlayBox(editable));
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!target || target.closest(INLINE_EDITOR_UI_SELECTOR)) {
        return;
      }

      const editable = target.closest<HTMLElement>('h1, h2, h3, h4, h5, h6, p, span, a, button, li, label');
      if (!editable || !isEditableElement(editable)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      updateSelection(editable);
    };

    const handleScrollOrResize = () => {
      if (!selectedElement) {
        return;
      }

      const element = document.querySelector(selectedElement.selector);
      if (element instanceof HTMLElement) {
        setSelectedBox(getOverlayBox(element));
      }
    };

    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [editorEnabled, selectedElement]);

  useEffect(() => {
    if (!editorEnabled || !selectedElement) {
      return;
    }

    const element = document.querySelector(selectedElement.selector);
    if (!(element instanceof HTMLElement)) {
      return;
    }

    setSelectedElement(readElementSnapshot(element, selectedElement.selector));
    setSelectedBox(getOverlayBox(element));
  }, [editorEnabled, elementOverrides, selectedElement?.selector, location.pathname]);

  const selectedOverride = useMemo(() => {
    if (!selectedElement) {
      return null;
    }

    return elementOverrides[selectedElement.selector] || {};
  }, [elementOverrides, selectedElement]);

  if (!editorEnabled) {
    return null;
  }

  const updateSelected = (patch: Record<string, string>) => {
    if (!selectedElement) {
      return;
    }

    updateElementOverride(selectedElement.selector, patch);
  };

  return (
    <>
      {hoveredBox && (
        <div
          data-inline-editor-ui="true"
          className="pointer-events-none absolute z-[88] border border-dashed border-brand-support/90 bg-brand-support/10"
          style={hoveredBox}
        />
      )}

      {selectedBox && (
        <div
          data-inline-editor-ui="true"
          className="pointer-events-none absolute z-[89] border-2 border-brand-accent shadow-[0_0_0_1px_rgba(180,222,0,0.2)]"
          style={selectedBox}
        />
      )}

      <aside
        data-inline-editor-ui="true"
        className="fixed left-6 top-24 z-[90] w-full max-w-sm overflow-hidden border border-brand-border bg-brand-primary shadow-2xl"
      >
        <div className="border-b border-brand-border px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent">Inline Editor</p>
          <h3 className="mt-2 text-lg font-display font-semibold">Редактирование на странице</h3>
          <p className="mt-2 text-xs leading-relaxed text-brand-muted">
            Кликните по любому текстовому элементу на сайте, чтобы изменить его содержимое и стиль.
          </p>
        </div>

        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5">
          {!selectedElement ? (
            <div className="space-y-4 text-sm text-brand-muted">
              <div className="flex items-center gap-3">
                <Focus className="h-4 w-4 text-brand-support" />
                Выберите заголовок, абзац, ссылку или кнопку.
              </div>
              <button
                type="button"
                onClick={resetElementOverrides}
                className="inline-flex items-center gap-2 border border-brand-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text"
              >
                <Eraser className="h-4 w-4" />
                Сбросить все локальные правки
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Выбранный элемент</p>
                <p className="text-sm font-medium">{selectedElement.tagName}</p>
              </div>

              <label className="block space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Текст</span>
                <textarea
                  value={selectedOverride?.text ?? selectedElement.text}
                  onChange={(event) => updateSelected({ text: event.target.value })}
                  className="min-h-28 w-full border border-brand-border px-4 py-3 text-sm outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Цвет</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={selectedOverride?.color ?? selectedElement.color}
                      onChange={(event) => updateSelected({ color: event.target.value })}
                      className="h-11 w-14 border border-brand-border bg-transparent"
                    />
                    <input
                      value={selectedOverride?.color ?? selectedElement.color}
                      onChange={(event) => updateSelected({ color: event.target.value })}
                      className="w-full border border-brand-border px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Размер, px</span>
                  <input
                    type="number"
                    min="10"
                    max="140"
                    value={selectedOverride?.fontSize?.replace('px', '') ?? selectedElement.fontSize}
                    onChange={(event) => updateSelected({ fontSize: `${event.target.value}px` })}
                    className="w-full border border-brand-border px-4 py-3 text-sm outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Насыщенность</span>
                  <select
                    value={selectedOverride?.fontWeight ?? selectedElement.fontWeight}
                    onChange={(event) => updateSelected({ fontWeight: event.target.value })}
                    className="w-full border border-brand-border px-4 py-3 text-sm outline-none"
                  >
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-muted">Трекинг, px</span>
                  <input
                    type="number"
                    min="-2"
                    max="20"
                    value={selectedOverride?.letterSpacing?.replace('px', '') ?? selectedElement.letterSpacing}
                    onChange={(event) => updateSelected({ letterSpacing: `${event.target.value}px` })}
                    className="w-full border border-brand-border px-4 py-3 text-sm outline-none"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateSelected({ fontStyle: (selectedOverride?.fontStyle ?? selectedElement.fontStyle) === 'italic' ? 'normal' : 'italic' })}
                  className="flex items-center justify-center gap-2 border border-brand-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                >
                  <Italic className="h-4 w-4" />
                  Курсив
                </button>
                <button
                  type="button"
                  onClick={() => updateSelected({ textTransform: (selectedOverride?.textTransform ?? selectedElement.textTransform) === 'uppercase' ? 'none' : 'uppercase' })}
                  className="flex items-center justify-center gap-2 border border-brand-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                >
                  <Type className="h-4 w-4" />
                  Uppercase
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => removeElementOverride(selectedElement.selector)}
                  className="border border-brand-border px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em]"
                >
                  Сбросить элемент
                </button>
                <button
                  type="button"
                  onClick={resetElementOverrides}
                  className="bg-brand-dark px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary"
                >
                  Сбросить все
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
