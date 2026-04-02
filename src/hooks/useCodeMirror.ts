"use client";

import { useEffect, useRef, useCallback } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap } from "@codemirror/search";

interface UseCodeMirrorProps {
  initialValue: string;
  onChange: (value: string) => void;
  onScroll?: (ratio: number) => void;
}

export function useCodeMirror({ initialValue, onChange, onScroll }: UseCodeMirrorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        updateListener,
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    const scrollHandler = () => {
      const dom = view.scrollDOM;
      const ratio = dom.scrollTop / (dom.scrollHeight - dom.clientHeight || 1);
      onScrollRef.current?.(ratio);
    };
    view.scrollDOM.addEventListener("scroll", scrollHandler);

    return () => {
      view.scrollDOM.removeEventListener("scroll", scrollHandler);
      view.destroy();
    };
  }, [initialValue]);

  const setValue = useCallback((value: string) => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
    });
  }, []);

  return { containerRef, setValue };
}
