import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlayerAdd from "./pages/AdminPlayerAdd";
import AdminUsers from "./pages/AdminUsers";
import AdminPosts from "./pages/AdminPosts";
import AdminPlayers from "./pages/AdminPlayers";
import AdminPlayerUpdate from "./pages/AdminPlayerUpdate";
import AdminComments from "./pages/AdminComments";
import AdminReplies from "./pages/AdminReplies";
import AdminAccessories from "./pages/AdminAccessories";
import AdminAccessoryAdd from "./pages/AdminAccessoryAdd";
import AdminAccessoryUpdate from "./pages/AdminAccessoryUpdate";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Posts from "./pages/Posts";
import Store from "./pages/Store";
import Rankings from "./pages/Rankings";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import PostAdd from "./pages/PostAdd";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={<UserLayout />}
			>
				<Route
					index
					element={<Home />}
				/>
				<Route
					path="login"
					element={<Login />}
				/>
				<Route
					path="register"
					element={<Register />}
				/>
				<Route
					path="game"
					element={<Game />}
				/>
				<Route
					path="posts"
					element={<Posts />}
				/>
				<Route
					path="posts/add"
					element={
						<ProtectedRoute isAdmin={false}>
							<PostAdd />
						</ProtectedRoute>
					}
				/>
				<Route
					path="store"
					element={<Store />}
				/>
				<Route
					path="rankings"
					element={<Rankings />}
				/>
				<Route
					path="contacts"
					element={<Contacts />}
				/>
				<Route
					path="profile/:username"
					element={<Profile />}
				/>
			</Route>

			<Route
				path="/admin"
				element={
					<ProtectedRoute isAdmin={true}>
						<AdminLayout />
					</ProtectedRoute>
				}
			>
				<Route
					index
					element={<AdminDashboard />}
				/>
				<Route
					path="users"
					element={<AdminUsers />}
				/>
				<Route
					path="posts"
					element={<AdminPosts />}
				/>
				<Route
					path="players"
					element={<AdminPlayers />}
				/>
				<Route
					path="players/add"
					element={<AdminPlayerAdd />}
				/>
				<Route
					path="players/update/:id"
					element={<AdminPlayerUpdate />}
				/>
				<Route
					path="comments"
					element={<AdminComments />}
				/>
				<Route
					path="replies"
					element={<AdminReplies />}
				/>
				<Route
					path="accessories"
					element={<AdminAccessories />}
				/>
				<Route
					path="accessories/add"
					element={<AdminAccessoryAdd />}
				/>
				<Route
					path="accessories/update/:id"
					element={<AdminAccessoryUpdate />}
				/>
			</Route>

			<Route
				path="*"
				element={
					<Navigate
						to="/"
						replace
					/>
				}
			/>
		</Routes>
	);
}

export default App;
