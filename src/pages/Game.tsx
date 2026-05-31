import React from 'react';
import type { PlayerDTO } from '../dtos/player';
import { BASE_URL } from '.';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/AuthContext';

const Game: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = React.useState<PlayerDTO[]>([]);
  const [lastWinner, setLastWinner] = React.useState<PlayerDTO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [userVote, setUserVote] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, voteRes, winnerRes] = await Promise.all([
          fetch(`${BASE_URL}/players`),
          user ? fetch(`${BASE_URL}/players/vote/me`, { credentials: "include" }) : Promise.resolve(new Response(JSON.stringify({ ok: false }), { status: 400 })),
          fetch(`${BASE_URL}/players/winner/last`)
        ]);
        
        const playersData = await playersRes.json();
        setPlayers(playersData);

        if (voteRes.ok) {
          const voteData = await voteRes.json();
          setUserVote(voteData.playerId);
        }

        if (winnerRes.ok) {
          const winnerData = await winnerRes.json();
          setLastWinner(winnerData);
        }
      } catch (err) {
        toast.error("Грешка при зареждане на данните");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleVote = async (player: PlayerDTO) => {
    if (!user) return toast.error("Трябва да сте регистрирани, за да гласувате!");
    
    try {
      const response = await fetch(`${BASE_URL}/players/vote`, {
        credentials: "include",
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: player.id, userId: user.id })
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setUserVote(player.id);
      } else {
        toast.error(data.message || "Грешка при гласуване.");
      }
    } catch (err) {
      toast.error("Грешка при изпращане на гласа.");
    }
  };

  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.club.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <title>Игра: Играч на седмицата – FutBrain</title>
      <section className="hero section-header-no-border text-center flex-column">
        <h1 className="text-light-green">Играч на седмицата</h1>
        {userVote ? (
            <div className="alert alert-success">Вече гласувахте за: <strong>{players.find(p => p.id === userVote)?.name}</strong></div>
        ) : (
            <p className="max-w-700 mt-15 mb-0">Гласувай за играча, който според теб се е представил най-добре през изминалата седмица. Ако твоят избор съвпадне с масовото мнение на общността, ще получиш <strong>FutCoins</strong> като награда!</p>
        )}
      </section>

      {lastWinner && (
        <section className="last-winner-section mt-40" style={{ marginBottom: '80px' }}>
            <div className="last-winner-card">
                <div className="winner-badge" style={{ position: 'relative' }}>
                    <i className="fas fa-crown" style={{ 
                        position: 'absolute', 
                        top: '-20px', 
                        left: '50%', 
                        transform: 'translateX(-50%) rotate(-15deg)', 
                        color: '#ffd700', 
                        fontSize: '2rem' 
                    }}></i>
                    <img 
                        src={lastWinner.playerImg} 
                        alt={lastWinner.name} 
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #ffd700' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/img/logo.png'; }}
                    />
                </div>
                <div className="winner-info text-center">
                    <h3 className="text-light-green">Победител от миналата седмица</h3>
                    <h2 className="text-white" style={{ fontSize: '2.5rem', margin: '10px 0' }}>{lastWinner.name}</h2>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <img 
                            src={lastWinner.clubImg} 
                            alt={lastWinner.club} 
                            style={{ width: '35px', height: '35px', objectFit: 'contain' }} 
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <p className="text-white" style={{ fontSize: '1.4rem', margin: 0, fontWeight: '600' }}>{lastWinner.club}</p>
                    </div>

                    <div className="reward-badge mt-15" style={{ background: '#ffd700', color: '#05204d', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', display: 'inline-block' }}>
                        <i className="fas fa-coins"></i> +100 FutCoins Награда
                    </div>
                </div>
            </div>
        </section>
      )}

      <div className="search-box w-full" style={{ marginBottom: '60px' }}>
        <input 
          type="text" 
          placeholder="Търси играчи по име или отбор..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button"><i className="fas fa-search"></i></button>
      </div>

      <section className="popular-players bg-none p-0">
        <div className="players-grid">
          {isLoading ? (
            <p className="text-white text-center w-full">Зареждане...</p>
          ) : filteredPlayers.length > 0 ? (
            filteredPlayers.map(player => (
              <div key={player.id} className="player-card">
                <div className="player-img-container">
                  <img 
                    src={player.playerImg} 
                    alt={player.name} 
                    onError={(e) => { (e.target as HTMLImageElement).src = '/img/logo.png'; }}
                  />
                </div>
                <h4>{player.name}</h4>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
                    <img 
                        src={player.clubImg} 
                        alt={player.club} 
                        style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <p className="text-primary-blue" style={{ fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>{player.club}</p>
                </div>

                <button 
                  className="btn-register btn-full mt-15"
                  disabled={!!userVote}
                  style={userVote === player.id ? { 
                    backgroundColor: '#ffd700', 
                    color: '#05204d', 
                    borderColor: '#ffd700',
                    opacity: 1 
                  } : {}}
                  onClick={() => handleVote(player)}
                >
                  {userVote === player.id ? 'Гласувано' : 'Гласувай'}
                </button>
              </div>
            ))
          ) : (
            <p className="no-results-msg">Няма намерени играчи.</p>
          )}
        </div>
      </section>

      <section className="latest-posts mt-40">
        <h3>Как работи играта?</h3>
        <ul className="game-rules-list">
          <li>Гласуването е отворено до неделя вечер.</li>
          <li>Всеки регистриран потребител има право на един глас.</li>
          <li>Резултатите се изчисляват автоматично в понеделник.</li>
        </ul>
      </section>
    </>
  );
};

export default Game;
