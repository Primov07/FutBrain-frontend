import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
//import '../styles/user.css';
import { toast } from "react-toastify";
import { BASE_URL } from '.';
import { useAuth } from '../auth/AuthContext';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]); // To store fetched posts
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 5;

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        
        const responseUser = await fetch(`${BASE_URL}users/${username}`);
        const jsonUser = await responseUser.json();
        if (!responseUser.ok) {
          throw new Error(jsonUser.message || "Неуспешно зареждане на потребителски данни.");
        }
        setProfileUser(jsonUser);

        const responsePosts = await fetch(`${BASE_URL}posts/user/${username}?page=${page}&limit=${postsPerPage}`);
        const jsonPosts = await responsePosts.json();
        console.log(jsonPosts);
        if (!responsePosts.ok) {
          throw new Error(jsonPosts.message || "Неуспешно зареждане на публикации.");
        }
        setPosts(jsonPosts);
        if (jsonPosts.length < postsPerPage) {
          setHasMore(false);
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileAndPosts();
    }
  }, [username, page]); // Re-fetch when page changes or username changes

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (loading) return <div className="text-center mt-40 text-white">Зареждане...</div>;
  if (!profileUser) return <div className="text-center mt-40 text-white">Потребителят не съществува.</div>;

  return (
    <div className="profile-container mt-40">
      <div className="profile-grid">
        <div className="profile-card">
          <img 
            src={`${BASE_URL}${profileUser.pictureURL || 'img/logo.png'}`} 
            alt={profileUser.username} 
            className="profile-avatar"
            onError={(e) => {
                (e.target as HTMLImageElement).src = 'img/logo.png'; 
            }}
          />
          {isOwnProfile && (
            <>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                name="avatar"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
										const formData = new FormData();
										formData.append("avatar", file);
										//@ts-ignore
										const response = await fetch(`${BASE_URL}users/profile`, {
											credentials: "include",
											method: "PUT",
											body: formData,
                    });
									}

                }}
              />
              <button className="btn-action mt-10" onClick={() => document.getElementById('avatar-upload')?.click()}>
                Смени снимката
              </button>
            </>
          )}
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
            <h3 className="section-title">Колекция аксесоари</h3>
            <div className="accessories-grid">
              {profileUser.accessories && profileUser.accessories.length > 0 ? (
                profileUser.accessories.map((acc: any) => (
                  <div key={acc.id} className="accessory-card">
                    <img 
                      src={`${BASE_URL}${acc.photo}`} 
                      alt="Аксесоар" 
                      className="accessory-photo"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'img/logo.png'; }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-light">Все още няма закупени аксесоари.</p>
              )}
            </div>
          </div>

          <div className="profile-section mt-40">
            <h3 className="section-title">Публикации</h3>
            <div className="posts-list">
              {posts.length > 0 ? (
                posts.map((post: any, index: number) => (
                  <div key={index} className="post-card mb-10">
                     
                     <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h4 className="text-primary-blue mb-5">{post.title}</h4> {/* Display post title */}
                        <p className="font-small">{post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}</p>
                     </Link>
                  </div>
                ))
              ) : (
                <p className="text-light">Няма налични публикации.</p>
              )}
            </div>
            {hasMore && (
              <div className="text-center mt-20">
                <button className="btn-action" onClick={loadMorePosts}>
                  Още публикации
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
