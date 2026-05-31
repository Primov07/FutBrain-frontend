export interface PostDTO {
	id: string;
	title: string;
	content: string;
	publishDate: Date;
	likedBy: string[];
	comments: string[];
    user: {
        id: string;
        username: string;
        pictureURL: string;
	}
	photo: string;
}
