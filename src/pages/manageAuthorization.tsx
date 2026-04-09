import { useState } from 'react';
import PageLayout from '../layouts/PageLayout';
import '../index.css';

interface Agent {
    cp: string;
    nom: string;
    prenom: string;
    email: string;
    role: 'UTILISATEUR' | 'ADMIN';
}

export default function ManageAuthorization() {
    const [searchCP, setSearchCP] = useState('');
    const [agent, setAgent] = useState<Agent | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSearch = async () => {
        if (!searchCP) return;

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const res = await fetch(`${API_URL}/agent/${searchCP}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                setAgent(null);
                setError(data.message || 'Aucun utilisateur trouvé');
            } else {
                setAgent(data);
            }
        } catch {
            setError('Erreur réseau');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!agent) return;

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const res = await fetch(`${API_URL}/agent/${agent.cp}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agent),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Erreur lors de la mise à jour');
            } else {
                setShowSaveModal(false);
                setSuccess('Modifications enregistrées avec succès !');
            }
        } catch {
            setError('Erreur réseau');
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!agent) return;

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const res = await fetch(`${API_URL}/agent/${agent.cp}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || 'Erreur lors de la suppression');
            } else {
                setAgent(null);
                setShowDeleteModal(false);
                setSuccess('Utilisateur supprimé avec succès !');
            }
        } catch {
            setError('Erreur réseau');
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setShowSaveModal(false);
        setShowDeleteModal(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <PageLayout requireAuth requiredRole="ADMIN">
            <section className="dashboardGrid pageSection">
                <div className="dashboardHero">
                    <div className="pageIntro">
                        <p className="pageEyebrow">Administration</p>
                        <h1>Gérer une habilitation</h1>
                        <p className="pageSubtitle">
                            Recherchez un collaborateur par CP puis modifiez son profil ou supprimez son accès.
                        </p>
                    </div>

                    <div className="infoGrid">
                        <div className="infoCard">
                            <strong>Recherche par CP</strong>
                            La gestion d&apos;une habilitation commence par la recherche d&apos;un utilisateur
                            existant à partir de son CP.
                        </div>
                        <div className="infoCard">
                            <strong>Modification du profil</strong>
                            Vous pouvez mettre à jour le nom, le prénom, l&apos;email professionnel
                            et le rôle attribué à l&apos;utilisateur.
                        </div>
                        <div className="infoCard">
                            <strong>Suppression de l&apos;accès</strong>
                            La suppression retire définitivement l&apos;utilisateur de l&apos;application.
                            Cette action doit être confirmée avant exécution.
                        </div>
                    </div>
                </div>

                <div className="updateContainer">
                    {success && <p className="successMessage">{success}</p>}
                    {error && <p className="errorMessage">{error}</p>}

                    <div className="searchPanel">
                        <div className="searchContainer">
                            <span className="searchIconWrapper" aria-hidden="true">
                                <img src="/search.png" alt="" />
                            </span>
                            <input
                                type="text"
                                placeholder="Entrer un CP pour gérer son habilitation"
                                value={searchCP}
                                onChange={(e) => {
                                    setSearchCP(e.target.value.toUpperCase());
                                    setError('');
                                    setSuccess('');
                                }}
                                onKeyDown={handleKeyPress}
                                className="searchBar"
                            />
                            <button
                                type="button"
                                className="secondaryButton"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? 'Recherche...' : 'Rechercher'}
                            </button>
                        </div>
                    </div>

                    {agent && (
                        <form>

                            <label htmlFor="cp">CP</label>
                            <input
                                id="cp"
                                type="text"
                                disabled
                                value={agent.cp}
                                onChange={(e) => { setAgent({ ...agent, cp: e.target.value }); setSuccess(''); }}
                            />

                            <label htmlFor="nom">Nom</label>
                            <input
                                id="nom"
                                type="text"
                                value={agent.nom}
                                onChange={(e) => { setAgent({ ...agent, nom: e.target.value }); setSuccess(''); }}
                            />

                            <label htmlFor="prenom">Prénom</label>
                            <input
                                id="prenom"
                                type="text"
                                value={agent.prenom}
                                onChange={(e) => { setAgent({ ...agent, prenom: e.target.value }); setSuccess(''); }}
                            />

                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={agent.email}
                                onChange={(e) => { setAgent({ ...agent, email: e.target.value }); setSuccess(''); }}
                            />


                            <label htmlFor="role">Rôle</label>
                            <select
                                id="role"
                                value={agent.role}
                                onChange={(e) => { setAgent({ ...agent, role: e.target.value as 'UTILISATEUR' | 'ADMIN' }); setSuccess(''); }}
                            >
                                <option value="UTILISATEUR">Utilisateur</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>

                            <div className="btnContainer">
                                <button type="button" className="accepte" onClick={() => setShowSaveModal(true)}>
                                    Enregistrer
                                </button>
                                <button type="button" className="decline" onClick={() => setShowDeleteModal(true)}>
                                    Supprimer
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {showSaveModal && <div className="modalOverlay"></div>}
                {showSaveModal && (
                    <div className="modalContainer">
                        <h2>Confirmer la modification</h2>
                        <div className="modalContent">
                            <p>Voulez-vous enregistrer les modifications apportées à cet utilisateur ?</p>
                        </div>
                        <div className="btnContainer">
                            <button type="button" className="accepte" onClick={handleSave}>Oui</button>
                            <button type="button" className="decline" onClick={handleCancel}>Non</button>
                        </div>
                    </div>
                )}

                {showDeleteModal && <div className="modalOverlay"></div>}
                {showDeleteModal && (
                    <div className="modalContainer">
                        <h2>Confirmer la suppression</h2>
                        <div className="modalContent">
                            <p>Voulez-vous supprimer cet utilisateur définitivement ?</p>
                        </div>
                        <div className="btnContainer">
                            <button type="button" className="accepte" onClick={handleDelete}>Oui</button>
                            <button type="button" className="decline" onClick={handleCancel}>Non</button>
                        </div>
                    </div>
                )}
            </section>
        </PageLayout>
    );
}
