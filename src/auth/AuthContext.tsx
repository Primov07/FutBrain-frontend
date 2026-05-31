import { createContext, useContext, useEffect, useState } from "react";

type User = {
	id: string;
	username: string;
	isAdmin: boolean;
	pictureURL: string;
	futcoins: number;
};

type AuthContextType = {
	user: User | null;
	loading: boolean;
	setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
			credentials: "include",
		})
			.then((res) => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then((data) => setUser(data))
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error(
			"Функцията useAuth трябва да бъде използвана в AuthProvider",
		);
	return context;
};
