import React from 'react';
import stylecss from '../../styles-page/exam.module.css';

const CardAddQuestion = ({ title, des, gifUrl, onClick}) => {
  return (
    <div className={stylecss.card_addquestion} onClick={onClick}>
      <div className={stylecss.cardContent_addquestion}>
        <p className={stylecss.cardTitle_addquestion}>{title}</p>
        <div className={stylecss.cardExample_addquestion} dangerouslySetInnerHTML={{ __html: des }} />
      </div>
      <div className={stylecss.cardImage_addquestion}>
        <img src={gifUrl} alt="GIF" className={stylecss.gifImage_addquestion} />
      </div>
    </div>
  );
};

export default CardAddQuestion;
