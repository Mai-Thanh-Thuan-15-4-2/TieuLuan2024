import React, { useEffect, useRef, useState } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState } from "draft-js";
import Toolbar from "../Toolbar/Toolbar";
import "./DraftEditor.css";
import htmlToDraft from 'html-to-draftjs';
import callAPI from "../../services/callAPI";
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SocketManager from "../../security/connectSocket";

const DropdownContainer = styled.div`
  margin-top: 10px;
  position: relative;
  display: inline-block;
  margin-right: auto;
  margin-left: 10px;
  width: 200px;
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f1f1f1;
  border-radius: 4px;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  display: ${({ open }) => (open ? 'block' : 'none')};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  z-index: 1;
  top: ${({ open }) => (open ? 'auto' : '100%')};
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const Dropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOutside = (event) => {
    if (event && !event.target.closest('.dropdown')) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleItemClick = (newValue) => {
    onChange(newValue);
    setOpen(false);
  };

  return (
    <DropdownContainer className="dropdown">
      <DropdownButton onClick={() => setOpen(!open)}>
        {options.find(option => option.value === value)?.label || 'Select an option'}
      </DropdownButton>
      <DropdownContent open={open}>
        {options.map((option, index) => (
          <DropdownItem key={index} onClick={() => handleItemClick(option.value)}>
            {option.label}
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownContainer>
  );
};


const DraftEditor = ({ title, questions, create, subject, nextExamId, closeEditExam }) => {
  const options = [
    { label: 'Trộn câu hỏi', value: '1' },
    { label: 'Trộn đáp án', value: '2' },
    { label: 'Trộn cả hai', value: '3' }
  ];
  const socketManager = new SocketManager();
  const { id } = useParams();
  const [showLoading, setShowLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [listQuestion, setListQuestion] = useState([...questions]);
  const [initialContent, setInitialContent] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [shuffleType, setShuffleType] = useState('1');
  const [newExam, setNewExam] = useState(initialContent);
  const handleShuffleChange = (value) => {
    setShuffleType(value);
  };
  const handleClickOutside = (event) => {
    closeEditExam();
    setShowModal(false);
  };
  useEffect(() => {
    if (initialContent !== null) {
      setNewExam({ contentState: initialContent });
    }
  }, [initialContent]);
  function shuffleQuestions(array) {
    if (!Array.isArray(array)) {
      console.error("shuffleMultipleChoiceQuestions: Input is not an array.");
      return [];
    }

    const newArray = [...array];
    const multipleChoiceQuestions = newArray.filter(question => question.type !== 6);
    for (let i = multipleChoiceQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [multipleChoiceQuestions[i], multipleChoiceQuestions[j]] = [multipleChoiceQuestions[j], multipleChoiceQuestions[i]];
    }
    return newArray.map(question => question.type !== 6 ? multipleChoiceQuestions.pop() : question);
  }
  function shuffleAnswers(array) {
    if (!Array.isArray(array)) {
      console.error("shuffleArray: Input is not an array.");
      return [];
    }

    const newArray = [...array];
    for (let i = 0; i < newArray.length; i++) {
      const question = newArray[i];
      if (question.type === 1 || question.type === 2 || question.type === 4) {
        if (question.answers && question.answers.length > 1) {
          const shuffledAnswers = shuffleAnswers(question.answers);
          newArray[i] = {
            ...question,
            answers: shuffledAnswers
          };
        }
      } else if (question.type === 5) {
        const shuffledChildQuestions = question.child_questions.map(childQuestion => {
          if (childQuestion.answers && childQuestion.answers.length > 1) {
            const shuffledChildAnswers = shuffleAnswers(childQuestion.answers);
            return {
              ...childQuestion,
              answers: shuffledChildAnswers
            };
          }
          return childQuestion;
        });
        newArray[i] = {
          ...question,
          child_questions: shuffledChildQuestions
        };
      }
    }
    return newArray;

    function shuffleAnswers(answers) {
      const shuffledAnswers = [...answers];
      for (let i = shuffledAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
      }
      return shuffledAnswers;
    }
  }
  function shuffleQuestionsAndAnswers(array) {
    if (!Array.isArray(array)) {
      console.error("shuffleQuestionsAndAnswers: Input is not an array.");
      return [];
    }

    const newArray = [...array];
    const multipleChoiceQuestions = newArray.filter(question => question.type !== 6);

    // Trộn câu hỏi trắc nghiệm
    for (let i = multipleChoiceQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [multipleChoiceQuestions[i], multipleChoiceQuestions[j]] = [multipleChoiceQuestions[j], multipleChoiceQuestions[i]];
    }

    // Trộn câu hỏi type 1, 2, 4 và đáp án của chúng
    for (let i = 0; i < multipleChoiceQuestions.length; i++) {
      const question = multipleChoiceQuestions[i];
      if (question.answers && question.answers.length > 1) {
        const shuffledAnswers = shuffleArray(question.answers); // Trộn đáp án
        multipleChoiceQuestions[i] = {
          ...question,
          answers: shuffledAnswers
        };
      }
    }

    // Trộn lại mảng gốc
    let currentIndex = 0;
    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i].type !== 6) {
        newArray[i] = multipleChoiceQuestions[currentIndex];
        currentIndex++;
      }
    }

    return newArray;
  }

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function mergeQuestions() {
    if (!Array.isArray(questions)) {
      console.error("mergeQuestions: Input 'questions' is not an array.");
      return [];
    }

    let shuffledQuestions = [];
    if (shuffleType === '1') {
      shuffledQuestions = shuffleQuestions(questions);
    } else if (shuffleType === '2') {
      shuffledQuestions = shuffleAnswers(questions);
    } else if (shuffleType === '3') {
      shuffledQuestions = shuffleQuestionsAndAnswers(questions);
    }

    const mergedQuestions = shuffledQuestions.map((question, index) => ({
      ...question,
      id: `CTMT${index + 1}`,
      viewers: index + 1
    }));
    setListQuestion(mergedQuestions);
    return mergedQuestions;
  }

  const saveExam = async () => {
    const api = new callAPI();
    setShowModal(true);
    try {
      await api.addExam(id, newExam);
      console.log("Exam saved successfully");
      setShowLoading(false);
    } catch (error) {
      console.error("Error saving exam:", error);
    }
  };
   const saveExamNoEdit = async () => {
    const api = new callAPI();
    setShowModal(true);
    try {
      await api.addExam(id, newExam);
      await api.updateStatusExam(id, nextExamId, 2);
      console.log("Exam saved successfully");
      setShowLoading(false);
    } catch (error) {
      console.error("Error saving exam:", error);
    }
  };
  useEffect(() => {
    let hasInsertedEssayHeader = false;
    let multipleChoiceQuestionCount = 0;
    let essayQuestionCount = 0;
    const lastBlock = {
      key: 'endBlock',
      text: 'HẾT',
      type: 'centerAlign',
      depth: 0,
      inlineStyleRanges: [{
        offset: 0,
        length: 6,
        style: "BOLD"
      }],
      entityRanges: [],
      data: {},
    };

    const contentBlocks = [
      {
        key: "title_exam",
        text: title,
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [
          {
            offset: 0,
            length: title.length,
            style: "BOLD"
          }
        ],
        entityRanges: [],
        data: {}
      },
      ...(listQuestion.some(question => question.type === 1 || question.type === 2 || question.type === 4) && listQuestion.some(question => question.type === 6)
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
          ...listQuestion.flatMap((question, index) => {
            const { contentBlocks, entityMap } = htmlToDraft(question.text);
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const raw = convertToRaw(contentState);

            if (question.type === 6 && !hasInsertedEssayHeader && listQuestion.some(q => q.type === 6)) {
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
                },
                ...(question.description ? (() => {
                  const { contentBlocks: descContentBlocks, entityMap: descEntityMap } = htmlToDraft(question.description);
                  const descContentState = ContentState.createFromBlockArray(descContentBlocks, descEntityMap);
                  const descRaw = convertToRaw(descContentState);
                  return descRaw.blocks.map((block, i) => ({
                    key: `description_${question.id}_${i}`,
                    text: block.text,
                    type: block.type,
                    depth: block.depth,
                    inlineStyleRanges: block.inlineStyleRanges,
                    entityRanges: block.entityRanges,
                    data: block.data,
                  }));
                })() : [])
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
                const descriptionBlocks = question.type === 6 && question.description ? (() => {
                  const { contentBlocks: descContentBlocks, entityMap: descEntityMap } = htmlToDraft(question.description);
                  const descContentState = ContentState.createFromBlockArray(descContentBlocks, descEntityMap);
                  const descRaw = convertToRaw(descContentState);
                  return descRaw.blocks.map((block, i) => ({
                    key: `description_${question.id}_${i}`,
                    text: '     ' + block.text,
                    type: block.type,
                    depth: block.depth,
                    inlineStyleRanges: block.inlineStyleRanges,
                    entityRanges: block.entityRanges,
                    data: block.data,
                  }));
                })() : [];

                return [questionBlock, ...descriptionBlocks];
              }
            }
          }),
        ]
        : listQuestion.flatMap((question, index) => {
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
            const descriptionBlocks = question.type === 6 && question.description ? (() => {
              const { contentBlocks: descContentBlocks, entityMap: descEntityMap } = htmlToDraft(question.description);
              const descContentState = ContentState.createFromBlockArray(descContentBlocks, descEntityMap);
              const descRaw = convertToRaw(descContentState);
              return descRaw.blocks.map((block, i) => ({
                key: `description_${question.id}_${i}`,
                text: block.text,
                type: block.type,
                depth: block.depth,
                inlineStyleRanges: block.inlineStyleRanges,
                entityRanges: block.entityRanges,
                data: block.data,
              }));
            })() : [];

            return [questionBlock, ...descriptionBlocks];
          }
        })
      ),
      lastBlock,
    ];
    setInitialContent({
      info: {
        id: nextExamId,
        status: 1,
        create_date: formatTimeToISO(create),
        edit_date: formatTimeToISO(new Date()),
        subject: subject,
      },
      entityMap: {},
      blocks: contentBlocks,
    });
  }, [listQuestion, title, create, nextExamId, subject]);
  useEffect(() => {
    if (initialContent) {
      const contentState = convertFromRaw(initialContent);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [initialContent]);

  const editor = useRef(null);

  useEffect(() => {
    if (editor.current) {
      editor.current.focus();
    }
  }, []);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };
  function formatTimeToISO(timeString) {
    const date = new Date(timeString);

    if (isNaN(date.getTime())) {
      console.error('Invalid time string:', timeString);
      return null;
    }

    const isoString = date.toISOString();
    return isoString;
  }
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
     saveExamNoEdit();
    if (newExam) {
      socketManager.addBlock(newExam);
    }
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
            if (initialContent) {
              const { info, ...rest } = initialContent;
              const newContentState = {
                info: info,
                entityMap: newState.entityMap,
                blocks: newState.blocks
              };
              if (newContentState.info.status === 2) {
                return;
              }

              setNewExam({ contentState: newContentState });
            }
            setEditorState(editorState);
          }}
        />
      </div>
      <Dropdown options={options} value={shuffleType} onChange={handleShuffleChange} />
      <button className='button_export' onClick={saveExam}>Lưu đề thi</button>
      <button className='button_export' onClick={() => Export2Word('exportContent', `${title}`)}>Xuất file .doc</button>
      <button className='button_export' onClick={mergeQuestions}><AutorenewIcon></AutorenewIcon> Trộn đề</button>
      {showModal && (
        <Overlay className="modal" onClick={handleClickOutside}>
          <SuccessContainer style={{ width: '250px' }}>
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
                  <Link to={`/teacher/${id}/examlist`}>
                    <button className="see-now">Xem ngay</button>
                  </Link>
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