import React, { useEffect, useRef, useState } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import Toolbar from "../Toolbar/Toolbar";
import "./DraftEditor.css";
import callAPI from "../../services/callAPI";

const DraftEditor = ({ content, id }) => {
  const initialContent = content;
  const api = new callAPI();
  const [editorState, setEditorState] = useState(() => {
    const contentState = convertFromRaw(initialContent);
    return EditorState.createWithContent(contentState);
  });
  const [newState, setNewState] = useState({});
  const editor = useRef(null);
  const save = async () => {
    const id_exam = content.info.id;
    try {
      await api.updateContentStateById(id, id_exam, newState.blocks);
      console.log('Content state updated successfully');
    } catch (error) {
      console.error('Error updating content state:', error);
    }
  };
  useEffect(() => {
    editor.current.focus();
  }, []);
  const getTitleFromContent = (content) => {
    for (const block of content.blocks) {
      if (block.key === "title_exam") {
        return block.text;
      }
    }
    return null;
  };
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };
console.log([newState.blocks])
  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: "#F7A5F7",
    },
    UPPERCASE: {
      textTransform: "uppercase",
    },
    LOWERCASE: {
      textTransform: "lowercase",
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: " 0.2rem",
    },
    SUPERSCRIPT: {
      verticalAlign: "super",
      fontSize: "80%",
    },
    SUBSCRIPT: {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };
  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    const key = contentBlock.getKey();
    if (key.startsWith('answer_exam')) {
      return 'answer_exam';
    }
    if (key.startsWith('title_exam')) {
      return 'title_exam';
    }
    if (key.startsWith('endBlock')) {
      return 'endBlock';
    }
    if (key.startsWith('question')) {
      return 'question';
    }
    if (key.startsWith('part')) {
      return 'part';
    }
    switch (type) {
      case "blockQuote":
        return "superFancyBlockquote";
      case "leftAlign":
        return "leftAlign";
      case "rightAlign":
        return "rightAlign";
      case "centerAlign":
        return "centerAlign";
      case "justifyAlign":
        return "justifyAlign";
      default:
        break;
    }
  };
  function Export2Word(element, filename = '') {
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml + document.getElementById(element).innerHTML + postHtml;

    var blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    filename = filename ? filename + '.doc' : 'document.doc';
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.click();
    }
    document.body.removeChild(downloadLink);
  }

  return (
    <div className="editor-wrapper">
      <Toolbar editorState={editorState} setEditorState={setEditorState} />
      <div className="editor-container" id="exportContent" onMouseDown={() => editor.current.focus()}>
        <style>
          {`
          .question{
            font-family:'Times New Roman', Times, serif;
            text-align: justify;
          }
           .title_exam{
            font-family:'Times New Roman', Times, serif;
            text-align: center;
            font-size: 24px;
            color: black;
            font-weight: bold;
          }
          .answer_exam {
            font-family:'Times New Roman', Times, serif;
            text-indent: 20px;
          }
          .endBlock{
            font-family:'Times New Roman', Times, serif;
            font-size: 20px;
            text-align: center;
            font-weight: bold;
            margin-top: 10px;
          }
          .part{
            font-family:'Times New Roman', Times, serif;
          }
        `}
        </style>
        <Editor
          ref={editor}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={(editorState) => {
            const contentState = editorState.getCurrentContent();
            const newState = convertToRaw(contentState);
            setNewState(newState);
            setEditorState(editorState);
          }}
        />
      </div>
      <button className='button_export' onClick={save}>Lưu đề thi</button>
      <button className='button_export' onClick={() => Export2Word('exportContent', getTitleFromContent(content))}>Xuất file .doc</button>
    </div>
  );
};

export default DraftEditor;
