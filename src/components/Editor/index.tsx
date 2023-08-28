// myCodemirror.tsx
import React, { useRef, useEffect } from 'react';
import { useModel } from '@umijs/max';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql  as sqlLang} from '@codemirror/lang-sql'; // 引入语言包



const Editor: React.FC = () => {
  const editorRef = useRef(null);
  const { setSql } = useModel('mysql');

  useEffect(() => {
    // 初始化CodeMirror编辑器
    const state = EditorState.create({
      //doc: '',
      extensions: [
        basicSetup,
        sqlLang(), // 在extensions中配置语言
        EditorView.updateListener.of((v) => {
            setSql(v.state.doc.toString() ?? '') ;//监测得到的最新代码 
         }),        
      ],
    });
    const editor = new EditorView({
      state,
      parent: editorRef.current ? editorRef.current : undefined,
    });
    return () => {
    
      editor.destroy(); // 注意：此后此处要随组件销毁
    };
  }, [editorRef]);
  return <div ref={editorRef}></div>;
};

export default Editor;