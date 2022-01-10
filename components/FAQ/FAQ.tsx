import React from 'react';
import styles from './FAQ.module.scss'

function FAQ() {
  const [openQuestions, setOpenQuestions] = React.useState({
    what: false,
    how: false,
    howStake: false,
    whyStake: false
  });

  function expandQuestion(question: 'what' | 'how' | 'howStake' | 'whyStake') {
    setOpenQuestions({
      ...openQuestions,
      [question]: !openQuestions[question]
    });
  }

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10">
            <h2>FAQ</h2>
            <div>
              <h3 className={styles.questionItemTitle} onClick={() => expandQuestion('what')}>
                <div className={`${styles.questionList} ${openQuestions.what ? styles.questionOpened : ''}`}>▶</div>
                What are creator pools?
              </h3>
              {openQuestions.what && (
                <>
                  <p>Creator pools introduce a new metaverse-ready social capital concept by staking with your creators and sharing in their success.</p>
                  <p>Just like with the more familiar liquidity pools, they require value to be locked in a form of a stake that will later yield rewards.</p>
                  <p>But instead of deriving value from pool’s performance, they use the performance of the creator’s NFTs as the generator of value.</p>
                </>
              )}
            </div>
            <div>
              <h3 className={styles.questionItemTitle} onClick={() => expandQuestion('how')}>
                <div className={`${styles.questionList} ${openQuestions.how ? styles.questionOpened : ''}`}>▶</div>
                How is value generated through NFTs?
              </h3>
              {openQuestions.how && (
                <>
                  <p>Staking with a creator's pool means you support the creator and his work. You also become part of his subDAO (more to follow).</p>
                  <p>With every NFT sale, the creator sends a small portion of his revenue back to his pool as rewards.</p>
                  <p>All pools and creators are also subject to additionally mined tokens through creator adoption mining mechnism. (more to follow)</p>
                </>
              )}
            </div>
            <div>
              <h3 className={styles.questionItemTitle} onClick={() => expandQuestion('howStake')}>
                <div className={`${styles.questionList} ${openQuestions.howStake ? styles.questionOpened : '' }`}>▶</div>
                How can I stake with a creator?
              </h3>
              {openQuestions.howStake && (
                <>
                  <p>Easy. First, make sure you own some $SWAY in your Metamask wallet. Get $SWAY here &gt; NOTE: Currently we only support creator pools on Polygon network.</p>
                  <p>Click on Stake and a pop-up will appear. Select the channel and provide the creator's identificator. Ie. on channel "Instagram" you can stake with a creator with the handle @metaverse. We don't validate entries, so make sure there's no typos.</p>
                  <p>And yes, that means you get to stake with any account you wish -- even if the creator hasn't claimed his pool yet.</p>
                </>
              )}
            </div>
            <div>
              <h3 className={styles.questionItemTitle} onClick={() => expandQuestion('whyStake')}>
                <div className={`${styles.questionList} ${openQuestions.whyStake ? styles.questionOpened : ''}`}>▶</div>
                Why should I stake?
              </h3>
              {openQuestions.whyStake && (
                <>
                  <p>Every pool needs to be claimed by the original creator in order to start paying out rewards. However, here's two reasons why you should start staking today.</p>
                  <p>1) PROMOTIONAL PERIOD. The first generation staking pool offers a promotional APR of up to 99% instead of direct returns from NFT sales. Read more</p>
                  <p>2) BEING FIRST PAYS OFF. The first position in the pool gets the most favorable terms and yields better rewards. You can sit at the top position forever. Might be a smart idea to be the first to stake with @garyvee or beeple.eth...?</p>
                  <p>If a creator doesn't claim his pool, you can simply withdraw your stake after the promotional period. Click on Stake to begin the withdrawal process.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
