import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '.';
import type { PostDTO } from '../dtos/post';

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = React.useState<PostDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const fetchPosts = () => {
    setIsLoading(true);
    fetch(`${BASE_URL}/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setIsLoading(false);
      })
      //@ts-ignore
      .catch(err => {
        toast.error("Грешка при зареждане на публикациите");
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id: string) => {
    if (window.confirm("Сигурни ли сте, че искате да изтриете тази публикация?")) {
      try {
        const response = await fetch(`${BASE_URL}/posts/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setPosts(posts.filter(p => p.id !== id));
          toast.success("Публикацията беше изтрита.");
        } else {
          toast.error("Грешка при изтриване.");
        }
      } catch (err) {
        toast.error("Грешка при комуникация със сървъра.");
      }
    }
  };

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="admin-content">Зареждане...</div>;

  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Управление на публикации</h2>
        <div className="header-actions">
          <div className="header-search">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Търси пост или автор..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-refresh" title="Обнови таблицата" onClick={fetchPosts}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Автор</th>
              <th>Съдържание (откъс)</th>
              <th>Дата на публикуване</th>
              <th>Харесвания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map(p => (
                <tr 
                  key={p.id} 
                  className="clickable-row" 
                  onClick={() => navigate(`/post/${p.id}`)}
                >
                  <td>
                    <div className="admin-profile" style={{justifyContent: 'flex-start'}}>
                      <img 
                        src={p.user.pictureURL.startsWith('http') ? p.user.pictureURL : `${BASE_URL}/uploads/user.png`} 
                        className="admin-avatar" 
                        style={{width: '30px', height: '30px'}}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/img/logo.png'; }}
                      />
                      <span>{p.user.username}</span>
                    </div>
                  </td>
                  <td title={p.content}>
                    {p.content.length > 50 ? p.content.substring(0, 50) + "..." : p.content}
                  </td>
                  <td>{new Date(p.publishDate).toLocaleDateString("bg-BG")}</td>
                  <td>{p.likedBy.length}</td>
                  <td className="actions">
                    <button 
                      className="btn-delete" 
                      title="Изтрий" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost(p.id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>Няма намерени публикации.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminPosts;
