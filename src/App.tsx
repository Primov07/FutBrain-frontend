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
import AdminAccessories from "./pages/AdminAccessories";
import AdminGame from "./pages/AdminGame";
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
import Post from "./pages/Post";
import PostUpdate from "./pages/PostUpdate";
import ProtectedRoute from "./auth/ProtectedRoute";
import ReportAdd from "./pages/ReportAdd";
import AdminReports from "./pages/AdminReports";
import AdminReport from "./pages/AdminReport";

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
					path="post/:id"
					element={<Post />}
				/>
				<Route
					path="post/update/:id"
					element={
						<ProtectedRoute isAdmin={false}>
							<PostUpdate />
						</ProtectedRoute>
					}
				/>
				<Route
					path="report/:targetId"
					element={
						<ProtectedRoute isAdmin={false}>
							<ReportAdd />
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
				<Route
					path="game"
					element={<AdminGame />}
				/>
				<Route
					path="reports"
					element={<AdminReports />}
				/>
				<Route
					path="reports/:id"
					element={<AdminReport />}
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
