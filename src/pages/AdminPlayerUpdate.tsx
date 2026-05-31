import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from ".";
import type { PlayerDTO } from ".";

interface Club {
	name: string;
	url: string;
}

const clubsUrl: string = `${BASE_URL}/clubs`;

const AdminPlayerUpdate: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [clubs, setClubs] = React.useState<Club[]>([]);
	const [selectedClub, setSelectedClub] = React.useState<Club | null>(null);
	const [playerName, setPlayerName] = React.useState<string>("");
	const [image, setImage] = React.useState<File | null>(null);
	const [imagePreview, setImagePreview] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const clubsResult = await fetch(clubsUrl);
				const clubsData: Club[] = await clubsResult.json();
				setClubs(clubsData);

				if (id) {
					const playerRes = await fetch(`${BASE_URL}/players/${id}`);
					if (!playerRes.ok) throw new Error("Играчът не е намерен.");
					const player: PlayerDTO = await playerRes.json();

					setPlayerName(player.name);
					setImagePreview(player.playerImg);

					const foundClub =
						clubsData.find((c) => c.name === player.club) || null;
					setSelectedClub(foundClub);
				} else throw new Error("Грешка при четенето на играча.");
			} catch (err) {
				toast.error((err as any).message);
				navigate("/admin/players");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, navigate]);

	React.useEffect(() => {
		if (!image) {
			return;
		}
		const objectUrl = URL.createObjectURL(image);
		if (image.name.split(".").pop() != "webp") {
			toast.error("Файлът трябва да бъде в .webp формат.");
		}

		setImagePreview(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [image]);

	const handleClubChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const clubName: string = event.target.value;
		const club: Club | null = clubs.find((c) => c.name === clubName) || null;
		setSelectedClub(club);
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData: FormData = new FormData(e.currentTarget);
		formData.append("id", id || "");

		try {
			const res = await fetch(`${BASE_URL}/players/`, {
				credentials: "include",
				method: "PUT",
				body: formData,
			});
			const json = await res.json();
			if (!res.ok) toast.error(json.message);
			else toast.success(json.message);
			navigate("/admin/players");
		} catch (err) {
			toast.error((err as any).message);
		}
	};

	if (isLoading) {
		return <div className="admin-content">Зареждане...</div>;
	}

	return (
		<>
			<div className="section-header">
				<h2>Редактирай играч</h2>
			</div>

			<div className="admin-form-container">
				<p className="form-validation-info">
					* Име на играча и снимка са задължителни.
				</p>
				<form
					className="admin-form"
					id="player-form"
					onSubmit={handleSubmit}
				>
					<div className="form-group">
						<label htmlFor="player-name">Име на играча</label>
						<input
							type="text"
							id="player-name"
							name="playerName"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
							placeholder="Въведете име..."
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="player-club">Клуб</label>
						<select
							id="player-club"
							value={selectedClub?.name || ""}
							name="club"
							onChange={handleClubChange}
						>
							<option
								value=""
								disabled
							>
								Изберете клуб...
							</option>
							{clubs.map((club) => (
								<option
									key={club.name}
									value={club.name}
								>
									{club.name}
								</option>
							))}
						</select>
					</div>

					<div className="form-group club-preview-container">
						<label>Лого на избрания клуб</label>
						<div
							className="club-logo-display"
							id="club-logo-preview"
						>
							{selectedClub ?
								<img
									src={`${selectedClub.url}`}
									alt={`${selectedClub.name}`}
								/>
							:	<p>Няма избран клуб</p>}
						</div>
					</div>

					<div className="form-group">
						<label htmlFor="player-img">
							Снимка на играча (оставете празно, ако не искате промяна)
						</label>
						<div className="file-input-wrapper">
							<button
								type="button"
								className="btn-file"
							>
								<i className="fas fa-upload"></i> Избери нова снимка
							</button>
							<input
								type="file"
								id="player-img"
								name="playerImg"
								accept="image/*"
								onChange={(e) => setImage(e.target.files?.[0] || null)}
							/>
						</div>
					</div>

					<div className="form-group player-preview-container">
						<label>Текуща/Нова снимка</label>
						<div
							className="club-logo-display"
							id="player-image-preview"
						>
							{imagePreview ?
								<img
									src={imagePreview}
									alt="Преглед на снимката"
								/>
							:	<p>Няма снимка</p>}
						</div>
					</div>

					<div className="form-actions">
						<button
							type="submit"
							className="btn-save"
							disabled={
								(image && image.name.split(".").pop() != "webp") ||
								!playerName.trim() ||
								!selectedClub
							}
						>
							Запази промените
						</button>
						<Link
							to="/admin/players"
							className="btn-cancel"
						>
							Отказ
						</Link>
					</div>
				</form>
			</div>
		</>
	);
};

export default AdminPlayerUpdate;
