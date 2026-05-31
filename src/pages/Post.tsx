import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { PostDTO } from "../dtos/post";
import type { CommentDTO } from "../dtos/comment";
import type { ReplyDTO } from "../dtos/reply";
import { BASE_URL } from ".";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
	const { user } = useAuth();
	const [comments, setComments] = React.useState<CommentDTO[]>([]);
	const [page, setPage] = React.useState(1);
	const [hasMore, setHasMore] = React.useState(true);
	const [showForm, setShowForm] = React.useState(false);
	const [content, setContent] = React.useState("");
	const navigate = useNavigate();

	const fetchComments = async (pageNum: number) => {
		try {
			const response = await fetch(
				`${BASE_URL}comments/post/${postId}?page=${pageNum}&limit=5`,
			);
			const data: CommentDTO[] = await response.json();

			if (data.length < 5) setHasMore(false);

			setComments((prev) => (pageNum === 1 ? data : [...prev, ...data]));
		} catch (err) {
			toast.error("Грешка при зареждане на коментарите");
		}
	};

	const handleCreateComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return toast.error("Трябва да сте регистрирани!");
		try {
			const response = await fetch(`${BASE_URL}comments`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content, user: user.id, post: postId }),
			});
			if (response.ok) {
				toast.success("Коментарът е добавен!");
				setContent("");
				setShowForm(false);
				setComments([]);
				setPage(1);
				fetchComments(1);
			} else {
				const data = await response.json();
				toast.error(data.message || "Грешка при добавяне");
			}
		} catch (err) {
			toast.error("Грешка при добавяне");
		}
	};

	const handleLikeComment = async (commentId: string) => {
		if (!user) return toast.error("Трябва да сте влезли в профила си!");
		try {
			const response = await fetch(`${BASE_URL}comments/like`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ commentId, userId: user.id }),
			});
			if (response.ok) {
				setComments((prev) =>
					prev.map((c) => {
						if (c.id === commentId) {
							const isLiked = c.likedBy.includes(user.id);
							return {
								...c,
								likedBy:
									isLiked ?
										c.likedBy.filter((id) => id !== user.id)
									:	[...c.likedBy, user.id],
							};
						}
						return c;
					}),
				);
			}
		} catch (err) {
			toast.error("Грешка при харесване");
		}
	};

	React.useEffect(() => {
		fetchComments(page);
	}, [page, postId]);

	return (
		<div className="comments-section active">
			<div className="section-header">
				<h3>Коментари</h3>
				{user && (
					<button
						className="btn-action"
						onClick={() => setShowForm(!showForm)}
					>
						{showForm ? "Откажи" : "Добави коментар"}
					</button>
				)}
			</div>

			{showForm && (
				<form
					className="comment-form"
					onSubmit={handleCreateComment}
				>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Напиши коментар..."
						required
					/>
					<button
						className="btn-action"
						type="submit"
					>
						Изпрати
					</button>
				</form>
			)}

			<div className="comments-list">
				{comments.map((comment) => {
					const isLiked = user ? comment.likedBy.includes(user.id) : false;
					return (
						<div
							key={comment.id}
							className="comment-item"
						>
							<div className="comment-header">
								<div className="comment-user-info">
									<img
										src={`${BASE_URL}${comment.user.pictureURL}`}
										alt={comment.user.username}
										className="comment-avatar"
										onError={(e) => {
											(e.target as HTMLImageElement).src = "img/logo.png";
										}}
									/>
									<Link
										to={`/profile/${comment.user.username}`}
										className="comment-username"
										style={{ marginRight: "15px" }}
									>
										{comment.user.username}
									</Link>
								</div>
								<span className="comment-date">
									{new Date(comment.publishDate).toLocaleDateString("bg-BG")}
								</span>
							</div>
							<p className="comment-text">{comment.content}</p>

							<div
								className="comment-footer"
								style={{
									display: "flex",
									gap: "15px",
									marginBottom: "10px",
									alignItems: "center",
								}}
							>
								<span
									onClick={() => handleLikeComment(comment.id)}
									style={{
										cursor: "pointer",
										color: isLiked ? "var(--primary-blue)" : "inherit",
										fontWeight: isLiked ? "bold" : "normal",
									}}
								>
									<i className={`${isLiked ? "fas" : "far"} fa-thumbs-up`}></i>{" "}
									{comment.likedBy.length}
								</span>
								{user && user.username !== comment.user.username && (
									<button
										className="btn-toggle-comments"
										onClick={() =>
											navigate(`/report/${comment.id}?type=Comment`)
										}
										title="Докладвай коментар"
										style={{ fontSize: "0.8rem" }}
									>
										<i className="fas fa-flag"></i> Докладвай
									</button>
								)}
							</div>

							<ReplySection
								commentId={comment.id}
								initialCount={comment.replies?.length || 0}
							/>
						</div>
					);
				})}
			</div>
			{hasMore && (
				<button
					className="btn-action mt-15"
					onClick={() => setPage((p) => p + 1)}
				>
					Още коментари
				</button>
			)}
		</div>
	);
};

const ReplySection: React.FC<{ commentId: string; initialCount: number }> = ({
	commentId,
	initialCount,
}) => {
	const { user } = useAuth();
	const [replies, setReplies] = React.useState<ReplyDTO[]>([]);
	//@ts-ignore
	const [page, setPage] = React.useState(1);
	const [hasMore, setHasMore] = React.useState(true);
	const [show, setShow] = React.useState(false);
	const [showForm, setShowForm] = React.useState(false);
	const [content, setContent] = React.useState("");
	const navigate = useNavigate();

	const fetchReplies = async (pageNum: number) => {
		try {
			const response = await fetch(
				`${BASE_URL}replies/comment/${commentId}?page=${pageNum}&limit=5`,
			);
			const data: ReplyDTO[] = await response.json();
			if (data.length < 5) setHasMore(false);
			setReplies((prev) => (pageNum === 1 ? data : [...prev, ...data]));
		} catch (err) {
			toast.error("Грешка при зареждане на отговорите");
		}
	};

	const handleCreateReply = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return toast.error("Трябва да сте регистрирани!");
		try {
			const response = await fetch(`${BASE_URL}replies`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content, user: user.id, comment: commentId }),
			});
			if (response.ok) {
				toast.success("Отговорът е добавен!");
				setContent("");
				setShowForm(false);
				setReplies([]);
				setPage(1);
				fetchReplies(1);
			} else {
				const data = await response.json();
				toast.error(data.message || "Грешка при добавяне");
			}
		} catch (err) {
			toast.error("Грешка при добавяне");
		}
	};

	const handleLikeReply = async (replyId: string) => {
		if (!user) return toast.error("Трябва да сте влезли в профила си!");
		try {
			const response = await fetch(`${BASE_URL}replies/like`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ replyId, userId: user.id }),
			});
			if (response.ok) {
				setReplies((prev) =>
					prev.map((r) => {
						if (r.id === replyId) {
							const isLiked = r.likedBy.includes(user.id);
							return {
								...r,
								likedBy:
									isLiked ?
										r.likedBy.filter((id) => id !== user.id)
									:	[...r.likedBy, user.id],
							};
						}
						return r;
					}),
				);
			}
		} catch (err) {
			toast.error("Грешка при харесване");
		}
	};

	const toggle = () => {
		if (!show && replies.length === 0) fetchReplies(1);
		setShow(!show);
	};

	return (
		<div className="replies-section">
			<div className="reply-actions">
				<button
					className="btn-toggle-comments"
					onClick={toggle}
				>
					<i className="far fa-comment"></i> Отговори (
					{replies.length > 0 ? replies.length : initialCount})
				</button>
				{user && (
					<button
						className="btn-toggle-comments"
						onClick={() => setShowForm(!showForm)}
					>
						{showForm ? "Откажи" : <i className="fas fa-reply"></i>}
					</button>
				)}
			</div>

			{showForm && (
				<form
					className="comment-form"
					onSubmit={handleCreateReply}
				>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Напиши отговор..."
						required
					/>
					<button
						className="btn-action"
						type="submit"
					>
						Изпрати
					</button>
				</form>
			)}

			{show && (
				<div
					className="replies-list"
					style={{
						marginLeft: "20px",
						borderLeft: "2px solid #eee",
						paddingLeft: "15px",
					}}
				>
					{replies.map((reply) => {
						const isLiked = user ? reply.likedBy.includes(user.id) : false;
						return (
							<div
								key={reply.id}
								className="reply-item mb-15"
							>
								<div className="comment-header">
									<div className="comment-user-info">
										<img
											src={
												`${BASE_URL}${reply.user.pictureURL}` || "img/logo.png"
											}
											alt={reply.user.username}
											className="comment-avatar"
											style={{ width: "25px", height: "25px" }}
											onError={(e) => {
												(e.target as HTMLImageElement).src = "img/logo.png";
											}}
										/>
										<Link
											to={`/profile/${reply.user.username}`}
											className="comment-username"
											style={{ fontSize: "0.85rem", marginRight: "10px" }}
										>
											{reply.user.username}
										</Link>
									</div>
									<span
										className="comment-date"
										style={{ fontSize: "0.75rem" }}
									>
										{new Date(reply.publishDate).toLocaleDateString("bg-BG")}
									</span>
								</div>
								<p
									className="comment-text"
									style={{ fontSize: "0.85rem" }}
								>
									{reply.content}
								</p>
								<div
									className="reply-footer"
									style={{ display: "flex", gap: "15px", alignItems: "center" }}
								>
									<span
										onClick={() => handleLikeReply(reply.id)}
										style={{
											cursor: "pointer",
											fontSize: "0.75rem",
											color: isLiked ? "var(--primary-blue)" : "inherit",
											fontWeight: isLiked ? "bold" : "normal",
										}}
									>
										<i
											className={`${isLiked ? "fas" : "far"} fa-thumbs-up`}
										></i>{" "}
										{reply.likedBy.length}
									</span>
									{user && user.id !== reply.user.id && (
										<button
											className="btn-toggle-comments"
											onClick={() => navigate(`/report/${reply.id}?type=Reply`)}
											title="Докладвай отговор"
											style={{ fontSize: "0.7rem" }}
										>
											<i className="fas fa-flag"></i> Докладвай
										</button>
									)}
								</div>
							</div>
						);
					})}
					{hasMore && (
						<button
							className="btn-action"
							onClick={() => setPage((p) => p + 1)}
						>
							Още отговори
						</button>
					)}
				</div>
			)}
		</div>
	);
};

const Post: React.FC = () => {
	const { user } = useAuth();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [post, setPost] = React.useState<PostDTO | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		if (!id) return;

		fetch(`${BASE_URL}posts/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setPost(data);
				setIsLoading(false);
			})
			//@ts-ignore
			.catch((err) => {
				toast.error("Грешка при зареждане на публикацията");
				navigate("/posts");
			});
	}, [id, navigate]);

	const handleLikePost = async () => {
		if (!id || !user) return toast.error("Трябва да сте влезли в профила си!");
		try {
			const response = await fetch(`${BASE_URL}posts/like`, {
				credentials: "include",
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ postId: id, userId: user.id }),
			});
			if (response.ok) {
				setPost((prev) => {
					if (!prev) return null;
					const isLiked = prev.likedBy.includes(user.id);
					return {
						...prev,
						likedBy:
							isLiked ?
								prev.likedBy.filter((uid) => uid !== user.id)
							:	[...prev.likedBy, user.id],
					};
				});
			}
		} catch (err) {
			toast.error("Грешка при харесване");
		}
	};

	if (isLoading) return <div className="admin-content">Зареждане...</div>;
	if (!post)
		return <div className="admin-content">Публикацията не е намерена.</div>;

	const isLiked = user ? post.likedBy.includes(user.id) : false;

	return (
		<div className="profile-container">
			<article
				className="post-card"
				style={{ maxWidth: "800px", margin: "0 auto" }}
			>
				<div className="post-header">
					<img
						src={`${BASE_URL}${post.user.pictureURL || "img/logo.png"}`}
						alt={post.user.username}
						className="user-avatar"
						onError={(e) => {
							(e.target as HTMLImageElement).src = "img/logo.png";
						}}
					/>
					<div className="user-info">
						<Link
							to={`/profile/${post.user.username}`}
							className="user-name"
							style={{ fontSize: "1.1rem", marginRight: "20px" }}
						>
							{post.user.username}
						</Link>
						<span className="post-date">
							{new Date(post.publishDate).toLocaleDateString("bg-BG")}
						</span>
					</div>
				</div>

				<div className="post-body">
					<h3 className="text-primary-blue mb-10">{post.title}</h3>
					{post.photo && (
						<div
							className="post-photo-container mb-20"
							style={{ textAlign: "center" }}
						>
							<img
								src={`${BASE_URL}posts/${post.photo}`}
								alt={post.title}
								style={{
									maxWidth: "100%",
									borderRadius: "10px",
									boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
								}}
								onError={(e) => {
									(e.target as HTMLImageElement).src = "img/logo.png";
								}}
							/>
						</div>
					)}
					<p>{post.content}</p>
				</div>

				<div
					className="post-footer"
					style={{ gap: "15px", flexWrap: "wrap" }}
				>
					<span
						onClick={handleLikePost}
						style={{
							cursor: "pointer",
							color: isLiked ? "var(--primary-blue)" : "inherit",
							fontWeight: isLiked ? "bold" : "normal",
						}}
					>
						<i className={`${isLiked ? "fas" : "far"} fa-thumbs-up`}></i>{" "}
						{post.likedBy.length} харесвания
					</span>
					<span>
						<i className="far fa-comment"></i> {post.comments.length} коментара
					</span>
					{user && user.id !== post.user.id && (
						<button
							className="btn-toggle-comments"
							onClick={() => navigate(`/report/${post.id}?type=Post`)}
							title="Докладвай публикация"
						>
							<i className="fas fa-flag"></i> Докладвай
						</button>
					)}
					{user?.id === post.user.id && (
						<Link
							to={`/post/update/${post.id}`}
							className="btn-edit-header"
							title="Редактирай"
							style={{ color: "var(--primary-blue)" }}
						>
							<i className="fas fa-edit"></i> Редактирай
						</Link>
					)}
				</div>

				<CommentSection postId={post.id} />
			</article>

			<div className="text-center mt-40">
				<button
					className="btn-cancel"
					onClick={() => navigate("/posts")}
				>
					Назад към всички публикации
				</button>
			</div>
		</div>
	);
};

export default Post;
