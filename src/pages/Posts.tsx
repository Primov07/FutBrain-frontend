import React from 'react';
import { Link } from 'react-router-dom';
import type { PostDTO } from '../dtos/post';
import type { CommentDTO } from '../dtos/comment';
import type { ReplyDTO } from '../dtos/reply';
import { BASE_URL } from '.';
import { toast } from "react-toastify";
import { useAuth } from '../auth/AuthContext';

const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = React.useState<CommentDTO[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [content, setContent] = React.useState('');

  const fetchComments = async (pageNum: number) => {
    try {
      const response = await fetch(`${BASE_URL}/comments/post/${postId}?page=${pageNum}`);
      const data: CommentDTO[] = await response.json();
      if (data.length < 5) setHasMore(false);
      setComments((prev) => {
        const newComments = pageNum === 1 ? data : [...prev, ...data];
        return newComments;
      });
    } catch (err) {
      toast.error("Грешка при зареждане на коментарите");
    }
  };

  const handleCreateComment = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return toast.error("Трябва да сте регистрирани!");
    try {
      const response = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, user: user.id, post: postId })
      });
      if (response.ok) {
        toast.success("Коментарът е добавен!");
        setContent('');
        setShowForm(false);
        setComments([]);
        setPage(1);
        fetchComments(1);
      }
      else toast.error("Грешка при коментиране.");
    } catch (err) {
      toast.error("Грешка при добавяне");
    }
  };

  React.useEffect(() => {
    fetchComments(page);
  }, [page]);

  return (
    <div className="comments-section active">
      {user && (
        <button className="btn-action" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Откажи' : 'Добави коментар'}
        </button>
      )}
      {showForm && (
        <form className="comment-form" onSubmit={handleCreateComment}>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
          <button className="btn-action" type="submit">Изпрати</button>
        </form>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-header">
             <div className="comment-user-info">
               <img 
                 src={comment.user.pictureURL?.startsWith('http') ? comment.user.pictureURL : `${BASE_URL}/uploads/user.png`} 
                 alt={comment.user.username} 
                 className="comment-avatar"
                 onError={(e) => { (e.target as HTMLImageElement).src = '/img/logo.png'; }}
               />
               <span className="comment-username">{comment.user.username}</span>
             </div>
             <span className="comment-date">
               {new Date(comment.publishDate).toLocaleDateString('bg-BG')}
             </span>
          </div>
          <p className="comment-text">{comment.content}</p>
          <ReplySection commentId={comment.id} />
        </div>
      ))}
      {hasMore && <button className="btn-action" onClick={() => setPage(p => p + 1)}>Още коментари</button>}
    </div>
  );
};

const ReplySection: React.FC<{ commentId: string }> = ({ commentId }) => {
  const { user } = useAuth();
  const [replies, setReplies] = React.useState<ReplyDTO[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [content, setContent] = React.useState('');

  const fetchReplies = async (pageNum: number) => {
    try {
      const response = await fetch(`${BASE_URL}/replies/comment/${commentId}?page=${pageNum}`);
      const data: ReplyDTO[] = await response.json();
      if (data.length < 5) setHasMore(false);
      setReplies((prev) => [...prev, ...data]);
    } catch (err) {
      toast.error("Грешка при зареждане на отговорите");
    }
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Трябва да сте регистрирани!");
    try {
      const response = await fetch(`${BASE_URL}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, user: user.id, comment: commentId })
      });
      if (response.ok) {
        toast.success("Отговорът е добавен!");
        setContent('');
        setShowForm(false);
        setReplies([]);
        setPage(1);
        fetchReplies(1);
      }
    } catch (err) {
      toast.error("Грешка при добавяне");
    }
  };

  const toggle = () => {
    if (!show && replies.length === 0) fetchReplies(1);
    setShow(!show);
  };

  return (
    <div className="replies-section">
      <button className="btn-action" onClick={toggle}>Отговори ({replies.length})</button>
      {user && <button className="btn-action" onClick={() => setShowForm(!showForm)}>{showForm ? 'Откажи' : 'Отговори'}</button>}
      {showForm && (
        <form className="comment-form" onSubmit={handleCreateReply}>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
          <button className="btn-action" type="submit">Изпрати</button>
        </form>
      )}
      {show && (
        <>
          {replies.map((reply) => <div key={reply.id} className="reply">{reply.content}</div>)}
          {hasMore && <button className="btn-action" onClick={() => setPage(p => p + 1)}>Още отговори</button>}
        </>
      )}
    </div>
  );
};

const Posts: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = React.useState<PostDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [showComments, setShowComments] = React.useState<Record<string, boolean>>({});

  const postsUrl = `${BASE_URL}/posts`;

  React.useEffect(() => {
    fetch(postsUrl)
      .then((response) => response.json())
      .then((data: PostDTO[]) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => toast.error((err as any).message));
  }, []);

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <>
      <title>Публикации – FutBrain</title>
      <section className="section-header section-header-no-border mb-0">
        <div className="header-with-action">
          <h1 className="text-light-green">Всички публикации</h1>
          {user && (
            <Link to="/posts/add" className="btn-create-post">
              <i className="fas fa-plus-circle"></i> Създай публикация
            </Link>
          )}
        </div>
      </section>

      <div className="posts-grid">
        {isLoading ? (
          <div className="admin-content">Зареждане...</div>
        ) : posts.map((post) => (
          <article key={post.id} className="post-card">
            <div className="post-header">
              <img 
                src={post.user.pictureURL.startsWith('http') ? post.user.pictureURL : `${BASE_URL}/uploads/user.png`} 
                alt={post.user.username} 
                className="user-avatar"
                onError={(e) => { (e.target as HTMLImageElement).src = '/img/logo.png'; }}
              />
              <span className="user-name">{post.user.username}</span>
              <span className="post-date">{new Date(post.publishDate).toLocaleDateString('bg-BG')}</span>
            </div>
            <div className="post-body">
              <p>{post.content}</p>
            </div>
            <div className="post-footer">
              <span><i className="far fa-thumbs-up"></i> {post.likedBy.length} харесвания</span>
              <button className="btn-toggle-comments" onClick={() => toggleComments(post.id)}>
                <i className="far fa-comment"></i> {post.comments.length} коментара
              </button>
            </div>
            {showComments[post.id] && <CommentSection postId={post.id} />}
          </article>
        ))}
      </div>
    </>
  );
};

export default Posts;
