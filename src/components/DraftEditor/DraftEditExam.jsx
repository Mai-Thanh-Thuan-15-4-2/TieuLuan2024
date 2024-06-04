import React, { useEffect, useRef, useState } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import Toolbar from "../Toolbar/Toolbar";
import "./DraftEditor.css";
import callAPI from "../../services/callAPI";
import styled from 'styled-components';


const DraftEditor = ({ content, id }) => {
  const initialContent = content;
  const api = new callAPI();
  const [editorState, setEditorState] = useState(() => {
    const contentState = convertFromRaw(initialContent);
    return EditorState.createWithContent(contentState);
  });
  const [showLoading, setShowLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newState, setNewState] = useState({});
  const editor = useRef(null);
  const handleClickOutside = (event) => {
    if (event.target.classList.contains('modal')) {
        setShowModal(false);
        setShowLoading(true);
    }
};
  const save = async () => {
    const id_exam = content.info.id;
    setShowModal(true);
    try {
      await api.updateContentStateById(id, id_exam, newState.blocks);
      setShowLoading(false);
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
      {showModal && (
                <Overlay className="modal" onClick={handleClickOutside}>
                    <SuccessContainer>
                        {showLoading ? (
                            <>
                                <Spinner />
                                <Text>Vui lòng chờ...</Text>
                            </>
                        ) : (
                            showLoading === false && (
                                <>
                                    <SuccessIcon>✓</SuccessIcon>
                                    <SuccessText>Thành công!</SuccessText>
                                </>
                            )
                        )}
                    </SuccessContainer>
                </Overlay>
            )}
    </div>
  );
};

export default DraftEditor;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Text = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const SuccessModal = styled(Overlay)`
  background-color: rgba(0, 0, 0, 0.7);
`;

const SuccessContainer = styled(LoadingContainer)`
  background-color: white;
  padding: 3rem;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  color: green;
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
`;