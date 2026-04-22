import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//import '../styles/user.css';
import { toast } from "react-toastify";
import { BASE_URL } from '.';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/users/${username}`);
        const json = await response.json();
        if (!response.ok) {
          return toast.error(json.message);
        }
        setProfileUser(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) return <div className="text-center mt-40 text-white">Зареждане...</div>;
  if (error) return <div className="text-center mt-40 text-white">Грешка: {error}</div>;
  if (!profileUser) return <div className="text-center mt-40 text-white">Потребителят не съществува.</div>;

  return (
    <div className="profile-container mt-40">
      <div className="profile-grid">
        <div className="profile-card">
          <img 
            src={profileUser.pictureURL.startsWith('http') ? profileUser.pictureURL : `${BASE_URL}${profileUser.pictureURL.replace('..', '')}`} 
            alt={profileUser.username} 
            className="profile-avatar"
            onError={(e) => {
                (e.target as HTMLImageElement).src = '/img/logo.png';
            }}
          />
          <h2 className="text-primary-blue">{profileUser.username}</h2>
          <p className="user-role-header">{profileUser.isAdmin ? 'Администратор' : 'Потребител'}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span>{profileUser.futcoins}</span>
              <label>FutCoins</label>
            </div>
            <div className="stat-item">
              <span>{profileUser.posts?.length || 0}</span>
              <label>Публикации</label>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3 className="section-title">Аксесоари</h3>
            <div className="accessories-grid">
              {profileUser.accessories && profileUser.accessories.length > 0 ? (
                profileUser.accessories.map((acc: any, index: number) => (
                  <div key={index} className="accessory-item">
                    {/* Тук ще се показва аксесоара, ако бекендът го връща като обект */}
                    <span>Аксесоар #{index + 1}</span>
                  </div>
                ))
              ) : (
                <p className="text-light">Няма налични аксесоари.</p>
              )}
            </div>
          </div>

          <div className="profile-section mt-40">
            <h3 className="section-title">Публикации</h3>
            <div className="posts-list">
              {profileUser.posts && profileUser.posts.length > 0 ? (
                profileUser.posts.map((post: any, index: number) => (
                  <div key={index} className="post-card mb-10">
                    <p>{typeof post === 'string' ? "Публикация ID: " + post : post.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-light">Няма налични публикации.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
