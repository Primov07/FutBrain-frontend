import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <title>FutBrain – футболна общност</title>
      <section className="hero">
        <div className="hero-content">
          <h1>Отключи своя футболен интелект</h1>
          <p>Присъедини се към най-страстната общност от футболни фенове. Обсъждай, анализирай и играй.</p>
          <div className="search-box">
            <input type="text" placeholder="Търси публикации, играчи, клубове..." />
            <button type="submit"><i className="fas fa-search"></i></button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/img/Football_Transparent_Image.png" alt="Футболна топка" />
        </div>
      </section>

      <section className="latest-posts">
        <div className="section-header">
          <h2>Последни дискусии</h2>
          <Link to="/posts" className="view-all">Виж всички <i className="fas fa-arrow-right"></i></Link>
        </div>
        <div className="posts-grid">
          <article className="post-card">
            <div className="post-header">
              <img src="/img/logo.png" alt="Потребител" className="user-avatar" />
              <span className="user-name">SoccerFan99</span>
              <span className="post-date">преди 2 часа</span>
            </div>
            <div className="post-body">
              <h3>Кой ще спечели Златната обувка този сезон?</h3>
              <p>С преминаването на Мбапе в Реал Мадрид състезанието за Златната обувка в Ла Лига ще бъде оспорвано...</p>
            </div>
            <div className="post-footer">
              <span><i className="far fa-thumbs-up"></i> 124 харесвания</span>
              <span><i className="far fa-comment"></i> 45 коментара</span>
            </div>
          </article>

          <article className="post-card">
            <div className="post-header">
              <img src="/img/logo.png" alt="Потребител" className="user-avatar" />
              <span className="user-name">TacticsMaster</span>
              <span className="post-date">преди 5 часа</span>
            </div>
            <div className="post-body">
              <h3>Анализ на тактиката на Шаби Алонсо в Леверкузен</h3>
              <p>Начинът, по който използват крайните си защитници, е революционен. Нека разгледаме формацията 3-4-2-1...</p>
            </div>
            <div className="post-footer">
              <span><i className="far fa-thumbs-up"></i> 89 харесвания</span>
              <span><i className="far fa-comment"></i> 12 коментара</span>
            </div>
          </article>

          <article className="post-card">
            <div className="post-header">
              <img src="/img/logo.png" alt="Потребител" className="user-avatar" />
              <span className="user-name">DerbyDay</span>
              <span className="post-date">преди 1 ден</span>
            </div>
            <div className="post-body">
              <h3>Прогнози за дербито на Северен Лондон</h3>
              <p>Арсенал е в страхотна форма, но Тотнъм като домакин винаги е опасен. Моята прогноза: 2:2.</p>
            </div>
            <div className="post-footer">
              <span><i className="far fa-thumbs-up"></i> 256 харесвания</span>
              <span><i className="far fa-comment"></i> 189 коментара</span>
            </div>
          </article>
        </div>
      </section>

      <section className="popular-players">
        <div className="section-header">
          <div>
            <h2>Играч на седмицата</h2>
            <p className="section-subtitle">Гласувай по собствена преценка! Наградите се раздават всеки понеделник според масовото мнение.</p>
          </div>
          <Link to="/game" className="view-all">Гласувай сега <i className="fas fa-check-to-slot"></i></Link>
        </div>
        <div className="players-grid">
          <div className="player-card">
            <div className="player-img-container">
              <img src="/img/logo.png" alt="Играч" />
            </div>
            <h4>Ерлинг Холанд</h4>
            <p>Манчестър Сити</p>
          </div>
          <div className="player-card">
            <div className="player-img-container">
              <img src="/img/logo.png" alt="Играч" />
            </div>
            <h4>Джуд Белингам</h4>
            <p>Реал Мадрид</p>
          </div>
          <div className="player-card">
            <div className="player-img-container">
              <img src="/img/logo.png" alt="Играч" />
            </div>
            <h4>Килиан Мбапе</h4>
            <p>Реал Мадрид</p>
          </div>
          <div className="player-card">
            <div className="player-img-container">
              <img src="/img/logo.png" alt="Играч" />
            </div>
            <h4>Ламин Ямал</h4>
            <p>ФК Барселона</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
