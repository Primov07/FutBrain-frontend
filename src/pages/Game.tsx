import React from 'react';

const Game: React.FC = () => {
  return (
    <>
      <title>Игра: Играч на седмицата – FutBrain</title>
      <section className="hero section-header-no-border text-center flex-column">
        <h1 className="text-light-green">Играч на седмицата</h1>
        <p className="max-w-700 mt-15 mb-0">Гласувай за играча, който според теб се е представил най-добре през изминалата седмица. Ако твоят избор съвпадне с масовото мнение на общността, ще получиш <strong>FutCoins</strong> като награда в понеделник сутрин!</p>
      </section>

      <section className="popular-players bg-none p-0">
        <div className="players-grid">
          <div className="player-card">
            <div className="player-img-container">
              <img src="/img/logo.png" alt="Играч" />
            </div>
            <h4>Ерлинг Холанд</h4>
            <p>Манчестър Сити</p>
            <button className="btn-register btn-full mt-15">Гласувай</button>
          </div>
          <div className="player-card">
            <div className="player-img-container">
              <img src="/img/logo.png" alt="Играч" />
            </div>
            <h4>Джуд Белингам</h4>
            <p>Реал Мадрид</p>
            <button className="btn-register btn-full mt-15">Гласувай</button>
          </div>
          <div className="player-card">
            <div className="player-img-container">
              <img src="/img/logo.png" alt="Играч" />
            </div>
            <h4>Килиан Мбапе</h4>
            <p>Реал Мадрид</p>
            <button className="btn-register btn-full mt-15">Гласувай</button>
          </div>
          <div className="player-card">
            <div className="player-img-container">
              <img src="/img/logo.png" alt="Играч" />
            </div>
            <h4>Ламин Ямал</h4>
            <p>ФК Барселона</p>
            <button className="btn-register btn-full mt-15">Гласувай</button>
          </div>
        </div>
      </section>

      <section className="latest-posts mt-40">
        <h3>Как работи играта?</h3>
        <ul className="game-rules-list">
          <li>Гласуването е отворено до неделя вечер.</li>
          <li>Всеки регистриран потребител има право на един глас.</li>
          <li>Резултатите се изчисляват автоматично в понеделник.</li>
          <li>Наградите варират спрямо трудността на прогнозата.</li>
        </ul>
      </section>
    </>
  );
};

export default Game;
