import React, { FC, useState } from 'react';
import styles from './FAQ.module.scss';
import { useConfig } from '../../contexts/Config';

const FAQ: FC = () => {
  const [openQuestions, setOpenQuestions] = useState({});
  const { site } = useConfig();

  function expandQuestion(question: string) {
    setOpenQuestions({
      ...openQuestions,
      [question]: !openQuestions[question]
    });
  }

  if (!site.faq?.length) {
    return null;
  }

  return (
    <section className="mt-5 mb-4">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10">
            <h2 className="mb-4">FAQ</h2>

            {site.faq.map(question => (
              <div className={styles.questionItem} key={question.title}>
                <h4 className={styles.questionItemTitle} onClick={() => expandQuestion(question.title)}>
                  <div className={`${styles.questionList} ${openQuestions[question.title] ? styles.questionOpened : ''}`}>▶</div>
                  {question.title}
                </h4>
                {openQuestions[question.title] && (
                  <div dangerouslySetInnerHTML={{ __html: question.content }}/>
                )}
              </div>
            ))}

          </div>
        </div>
        <hr className="mt-5"/>
      </div>
    </section>
  );
}

export default FAQ;
