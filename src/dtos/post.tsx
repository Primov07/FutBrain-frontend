export interface PostDTO {
	id: string;
	content: string;
	publishDate: Date;
	likedBy: string[];
	comments: string[];
    user: {
        username: string;
        pictureURL: string;
    }
}
