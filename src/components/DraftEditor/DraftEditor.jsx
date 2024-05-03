import React, { useEffect, useRef, useState } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState } from "draft-js";
import Toolbar from "../Toolbar/Toolbar";
import "./DraftEditor.css";
import htmlToDraft from 'html-to-draftjs';

const DraftEditor = ({ title, questions, create, subject }) => {
  let hasInsertedEssayHeader = false;
  const lastBlock = {
    key: 'endBlock',
    text: 'HẾT',
    type: 'centerAlign',
    depth: 0,
    inlineStyleRanges: [{
      "offset": 0,
      "length": 6,
      "style": "BOLD"
    }],
    entityRanges: [],
    data: {},
  };
  let multipleChoiceQuestionCount = 0;
  let essayQuestionCount = 0;

  const initialContent = {
    info: {
      "id": "CTMT_EX01",
      "status": 1,
      "create_date": create,
      "edit_date": new Date(),
      "subject": subject
    },
    entityMap: {},
    blocks: [
      {
        "key": "title_exam",
        "text": title,
        "type": "unstyle",
        "depth": 0,
        "inlineStyleRanges": [
          {
            "offset": 0,
            "length": title.length,
            "style": "BOLD"
          }
        ],
        "entityRanges": [],
        "data": {}
      },
      ...(questions.some(question => question.type === 1 || question.type === 2 || question.type === 4) && questions.some(question => question.type === 6)
        ? [
          {
            key: 'part1',
            text: 'Phần 1: Trắc nghiệm',
            type: 'header-three',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          ...questions.flatMap((question, index) => {
            const { contentBlocks, entityMap } = htmlToDraft(question.text);
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const raw = convertToRaw(contentState);
            if (question.type === 6 && !hasInsertedEssayHeader && questions.some(question => question.type === 6)) {
              hasInsertedEssayHeader = true;
              return [
                {
                  key: 'part2',
                  text: 'Phần 2: Tự luận',
                  type: 'header-three',
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: {},
                },
                {
                  key: `question_${question.id}`,
                  text: `${++essayQuestionCount}. ${raw.blocks[0].text}`,
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [
                    {
                      offset: 0,
                      length: question.text.length + 5,
                      style: 'BOLD',
                    },
                  ],
                  entityRanges: [],
                  data: {},
                }
              ];
            } else if (question.type === 5) {
              const questionLabelBlock = {
                key: `label_${question.id}`,
                text: 'Đoạn văn',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [{
                  offset: 0,
                  length: 'Đoạn văn'.length,
                  style: 'BOLD',
                }],
                entityRanges: [],
                data: {},
              };
              const questionBlock = {
                key: `question_${question.id}`,
                text: `${raw.blocks[0].text}`,
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              };

              const childQuestions = question.child_questions.flatMap((childQuestion, childIndex) => {
                const childQuestionBlock = {
                  key: `question_${childQuestion.id}`,
                  text: `${question.type === 6 ? ++essayQuestionCount : ++multipleChoiceQuestionCount}. ${childQuestion.text}`,
                  type: 'unstyled',
                  depth: 0,
                  inlineStyleRanges: [{
                    offset: 0,
                    length: question.text.length + 5,
                    style: 'BOLD',
                  }],
                  entityRanges: [],
                  data: {},
                };
                const childAnswerBlocks = childQuestion.answers.map((answer, answerIndex) => ({
                  key: `answer_x${childQuestion.id}_${answer.id}`,
                  text: `${String.fromCharCode(65 + answerIndex)}. ${answer.text}`,
                  type: 'unstyled',
                  depth: 5,
                  inlineStyleRanges: [
                    {
                      offset: 0,
                      length: 2,
                      style: 'BOLD',
                    },
                  ],
                  entityRanges: [],
                  data: {},
                }));

                return [childQuestionBlock, ...childAnswerBlocks];
              });

              return [questionLabelBlock, questionBlock, ...childQuestions];
            } else {
              const questionBlock = {
                key: `question_${question.id}`,
                text: `${question.type === 6 ? ++essayQuestionCount : ++multipleChoiceQuestionCount}. ${raw.blocks[0].text}`,
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [
                  {
                    offset: 0,
                    length: question.text.length + 5,
                    style: 'BOLD',
                  },
                ],
                entityRanges: [],
                data: {},
              };

              if (question.type === 1 || question.type === 2 || question.type === 4) {
                const answerBlocks = question.answers.map((answer, answerIndex) => ({
                  key: `answer_exam${index}${answerIndex}`,
                  text: `${String.fromCharCode(65 + answerIndex)}. ${answer.text}`,
                  type: 'unstyled',
                  depth: 5,
                  inlineStyleRanges: [
                    {
                      offset: 0,
                      length: 2,
                      style: 'BOLD',
                    },
                  ],
                  entityRanges: [],
                  data: {},
                }));

                return [questionBlock, ...answerBlocks];
              } else {
                return [questionBlock];
              }
            }
          }),
        ]
        : questions.flatMap((question, index) => {
          const { contentBlocks, entityMap } = htmlToDraft(question.text);
          const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
          const raw = convertToRaw(contentState);
          const questionBlock = {
            key: `question_${question.id}`,
            text: `${question.type === 6 ? ++essayQuestionCount : ++multipleChoiceQuestionCount}. ${raw.blocks[0].text}`,
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [
              {
                offset: 0,
                length: question.text.length + 5,
                style: 'BOLD',
              },
            ],
            entityRanges: [],
            data: {},
          };

          if (question.type === 1 || question.type === 2 || question.type === 4) {
            const answerBlocks = question.answers.map((answer, answerIndex) => ({
              key: `answer_exam${index}${answerIndex}`,
              text: `${String.fromCharCode(65 + answerIndex)}. ${answer.text}`,
              type: 'unstyled',
              depth: 5,
              inlineStyleRanges: [
                {
                  offset: 0,
                  length: 2,
                  style: 'BOLD',
                },
              ],
              entityRanges: [],
              data: {},
            }));

            return [questionBlock, ...answerBlocks];
          } else if (question.type === 5) {
            const questionLabelBlock = {
              key: `label_${question.id}`,
              text: 'Đoạn văn',
              type: 'unstyled',
              depth: 0,
              inlineStyleRanges: [{
                offset: 0,
                length: 'Đoạn văn'.length,
                style: 'BOLD',
              }],
              entityRanges: [],
              data: {},
            };
            const questionBlock = {
              key: `question_${question.id}`,
              text: `${raw.blocks[0].text}`,
              type: 'unstyled',
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            };

            const childQuestions = question.child_questions.flatMap((childQuestion, childIndex) => {
              const childQuestionBlock = {
                key: `question_${childQuestion.id}`,
                text: `${question.type === 6 ? ++essayQuestionCount : ++multipleChoiceQuestionCount}. ${childQuestion.text}`,
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [{
                  offset: 0,
                  length: question.text.length + 5,
                  style: 'BOLD',
                }],
                entityRanges: [],
                data: {},
              };

              const childAnswerBlocks = childQuestion.answers.map((answer, answerIndex) => ({
                key: `answer_x${childQuestion.id}_${answer.id}`,
                text: `${String.fromCharCode(65 + answerIndex)}. ${answer.text}`,
                type: 'unstyled',
                depth: 5,
                inlineStyleRanges: [
                  {
                    offset: 0,
                    length: 2,
                    style: 'BOLD',
                  },
                ],
                entityRanges: [],
                data: {},
              }));

              return [childQuestionBlock, ...childAnswerBlocks];
            });

            return [questionLabelBlock, questionBlock, ...childQuestions];
          } else {
            return [questionBlock];
          }
        })
      ),
      lastBlock,
    ],
  };

  console.log(initialContent)
  const [editorState, setEditorState] = useState(() => {
    const contentState = convertFromRaw(initialContent);
    return EditorState.createWithContent(contentState);
  });

  const editor = useRef(null);

  useEffect(() => {
    editor.current.focus();
  }, []);
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

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

  // FOR BLOCK LEVEL STYLES(Returns CSS Class From DraftEditor.css)
  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    const key = contentBlock.getKey();
    if (key.startsWith('answer_exam')) {
      return 'answer_exam';
    }
    if (key.startsWith('answer_x')) {
      return 'answer_x';
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
          .answer_x {
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
            console.log(newState);
            setEditorState(editorState);
          }}
        />
      </div>
      <button className='button_export'>Lưu đề thi</button>
      <button className='button_export' onClick={() => Export2Word('exportContent', `${title}`)}>Xuất file .doc</button>
    </div>
  );
};

export default DraftEditor;
