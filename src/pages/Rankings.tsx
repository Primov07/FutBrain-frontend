import React from 'react';
import { BASE_URL } from '.';
import type { PostDTO } from '../dtos/post';
import type { UserDTO } from '../dtos/user';
import type { CommentDTO } from '../dtos/comment';
import type { ReplyDTO } from '../dtos/reply';
import { toast } from 'react-toastify';

const Rankings: React.FC = () => {
  const [topPosts, setTopPosts] = React.useState<PostDTO[]>([]);
  const [topUsersCoins, setTopUsersCoins] = React.useState<UserDTO[]>([]);
  const [topUsersLikes, setTopUsersLikes] = React.useState<{ username: string, totalLikes: number }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes, commentsRes, repliesRes] = await Promise.all([
          fetch(`${BASE_URL}/posts`),
          fetch(`${BASE_URL}/users`),
          fetch(`${BASE_URL}/comments`),
          fetch(`${BASE_URL}/replies`)
        ]);

        const posts: PostDTO[] = await postsRes.json();
        const users: UserDTO[] = await usersRes.json();
        const comments: CommentDTO[] = await commentsRes.json();
        const replies: ReplyDTO[] = await repliesRes.json();

        // 1. Top 5 Most Liked Posts
        const sortedPosts = [...posts]
          .sort((a, b) => b.likedBy.length - a.likedBy.length)
          .slice(0, 5);
        setTopPosts(sortedPosts);

        // 2. Top 5 Users by FutCoins
        const sortedUsersByCoins = [...users]
          .sort((a, b) => b.futcoins - a.futcoins)
          .slice(0, 5);
        setTopUsersCoins(sortedUsersByCoins);

        // 3. Top 5 Users by Total Likes (Posts + Comments + Replies)
        const userLikesMap: Record<string, number> = {};
        
        // Initialize all users with 0 likes
        users.forEach(u => {
          userLikesMap[u.username] = 0;
        });

        // Add likes from posts
        posts.forEach(p => {
          if (userLikesMap[p.user.username] !== undefined) {
            userLikesMap[p.user.username] += p.likedBy.length;
          }
        });

        // Add likes from comments
        comments.forEach(c => {
          if (userLikesMap[c.user.username] !== undefined) {
            userLikesMap[c.user.username] += c.likedBy.length;
          }
        });

        // Add likes from replies
        replies.forEach(r => {
          if (userLikesMap[r.user.username] !== undefined) {
            userLikesMap[r.user.username] += r.likedBy.length;
          }
        });

        const sortedUsersByLikes = Object.entries(userLikesMap)
          .map(([username, totalLikes]) => ({ username, totalLikes }))
          .sort((a, b) => b.totalLikes - a.totalLikes)
          .slice(0, 5);
        
        setTopUsersLikes(sortedUsersByLikes);
        setIsLoading(false);
      } catch (err) {
        toast.error("Грешка при зареждане на класациите");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="admin-content" style={{ color: 'white' }}>Зареждане на класации...</div>;

  return (
    <>
      <title>Класации – FutBrain</title>
      
      {/* Table 1: Most Liked Posts */}
      <section className="data-section mb-30">
        <div className="section-header">
          <h2 className="text-primary-blue"><i className="fas fa-fire"></i> Най-харесвани публикации</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Място</th>
                <th>Заглавие</th>
                <th>Автор</th>
                <th>Харесвания</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post, index) => (
                <tr key={post.id}>
                  <td><span className={`rank-badge rank-${index + 1}`}>{index + 1}</span></td>
                  <td>{post.title}</td>
                  <td>{post.user.username}</td>
                  <td><strong>{post.likedBy.length}</strong></td>
                </tr>
              ))}
              {topPosts.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center' }}>Няма данни</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Table 2: Top Users by FutCoins */}
      <section className="data-section mb-30">
        <div className="section-header">
          <h2 className="text-primary-blue"><i className="fas fa-coins"></i> Топ 5 потребители по FutCoins</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Място</th>
                <th>Потребител</th>
                <th>FutCoins</th>
              </tr>
            </thead>
            <tbody>
              {topUsersCoins.map((user, index) => (
                <tr key={user.id}>
                  <td><span className={`rank-badge rank-${index + 1}`}>{index + 1}</span></td>
                  <td>{user.username}</td>
                  <td className="text-dark-green"><strong>{user.futcoins}</strong></td>
                </tr>
              ))}
              {topUsersCoins.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center' }}>Няма данни</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Table 3: Top Users by Total Likes */}
      <section className="data-section">
        <div className="section-header">
          <h2 className="text-primary-blue"><i className="fas fa-thumbs-up"></i> Топ 5 най-харесвани потребители</h2>
        </div>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Място</th>
                <th>Потребител</th>
                <th>Общо харесвания</th>
              </tr>
            </thead>
            <tbody>
              {topUsersLikes.map((userData, index) => (
                <tr key={userData.username}>
                  <td><span className={`rank-badge rank-${index + 1}`}>{index + 1}</span></td>
                  <td>{userData.username}</td>
                  <td><strong>{userData.totalLikes}</strong></td>
                </tr>
              ))}
              {topUsersLikes.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center' }}>Няма данни</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Rankings;
