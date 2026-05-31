export interface UserDTO {
	id: string;
	username: string;
	email: string;
	pictureURL: string;
	isAdmin: boolean;
	futcoins: number;
	comments: string[];
	posts: string[];
	likedPosts: string[];
	likedComments: string[];
	replies: string[];
	likedReplies: string[];
	accessories: {
		id: string;
		photo: string;
	}[];
}
