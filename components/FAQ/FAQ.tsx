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
            <h2 className="questionTitle">What is staking?</h2>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
