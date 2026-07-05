import { PenTool, X } from 'lucide-react';
import { useSiteEditor } from '../context/SiteEditorContext';

export const EditorLauncher = () => {
  const { editorEnabled, setEditorEnabled } = useSiteEditor();

  return (
    <button
      type="button"
      onClick={() => setEditorEnabled(!editorEnabled)}
      data-inline-editor-ui="true"
      className="fixed bottom-6 left-6 z-[95] flex items-center gap-3 rounded-full border border-brand-border bg-brand-primary px-5 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text shadow-xl transition-colors hover:bg-brand-warm"
    >
      {editorEnabled ? <X className="h-4 w-4" /> : <PenTool className="h-4 w-4 text-brand-support" />}
      {editorEnabled ? 'Скрыть редактор' : 'Включить редактор'}
    </button>
  );
};
