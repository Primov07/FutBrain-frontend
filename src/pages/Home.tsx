import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '.';
import type { PlayerDTO } from '../dtos/player';
import { useAuth } from '../auth/AuthContext';

interface PostDTO {
  id: string;
  title: string;
  content: string;
  photo?: string;
  user: {
    id: string;
    username: string;
    pictureURL: string;
  };
  likedBy: string[];
  comments: string[];
  publishDate: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${BASE_URL}/posts`)
      .then(res => res.json())
      .then((data: PostDTO[]) => {
        setPosts(data.slice(-3).reverse());
      });

    fetch(`${BASE_URL}/players`)
      .then(res => res.json())
      .then((data: PlayerDTO[]) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setPlayers(shuffled.slice(0, 3));
      });
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Отключи своя футболен интелект</h1>
          <p>Присъедини се към най-страстната общност от футболни фенове. Обсъждай, анализирай и играй.</p>
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
          {posts.map(post => (
            <Link key={post.id} to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
              <article className="post-card">
                <div className="post-header">
                  <img 
                    src={post.user?.pictureURL || '/img/logo.png'} 
                    alt="Потребител" 
                    className="user-avatar" 
                  />
                  <span className="user-name">{post.user?.username || 'Unknown'}</span>
                  <span className="post-date">{new Date(post.publishDate).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </div>
                <div className="post-body">
                  <h3>{post.title}</h3>
                  <p>{post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}</p>
                </div>
                <div className="post-footer">
                  <span style={{ color: user && post.likedBy?.includes(user.id) ? '#2ecc71' : 'inherit' }}>
                    <i className="far fa-thumbs-up"></i> {post.likedBy?.length || 0}
                  </span>
                  <span><i className="far fa-comment"></i> {post.comments?.length || 0}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

      </section>

      <section className="popular-players">
        <div className="section-header">
          <div>
            <h2>Играч на седмицата</h2>
          </div>
          <Link to="/game" className="view-all">Гласувай сега <i className="fas fa-check-to-slot"></i></Link>
        </div>
        <div className="players-grid">
          {players.map(player => (
            <div key={player.id} className="player-card">
              <div className="player-img-container">
                <img src={player.playerImg} alt={player.name} />
              </div>
              <h4>{player.name}</h4>
              <p>{player.club}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
