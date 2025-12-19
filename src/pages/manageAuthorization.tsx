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

    // --- Recherche par CP ---
    const handleSearch = async () => {
        if (!searchCP) return;

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const res = await fetch(`${API_URL}/agent/${searchCP}`, {
                method: 'GET',
                credentials: 'include', // envoie le cookie
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

    // --- Enregistrement ---
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

    // --- Suppression ---
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
        <PageLayout>
            <div className="updateContainer">
                <h1>Gérer une habilitation</h1>

                {success && <p className="successMessage">{success}</p>}
                {error && <p className="errorMessage">{error}</p>}

                <div className='searchContainer'>
                    <img src="../../public/search.png" alt="logo Rechercher" />
                    <input
                        type="text"
                        placeholder="Entrer un CP pour gérer son habilitation"
                        value={searchCP}
                        onChange={(e) => { setSearchCP(e.target.value); setError(''); setSuccess(''); }}
                        onKeyDown={handleKeyPress}
                        className="border-0 rounded searchBar"
                    />
                </div>

                {agent && (

                    <form className="mt-4">

                        <label htmlFor="cp">CP</label>
                        <input
                            id="cp"
                            type="text"
                            disabled
                            value={agent.cp}
                            onChange={(e) => { setAgent({ ...agent, cp: e.target.value }); setSuccess(''); }}
                            className="border rounded"
                        />

                        <label htmlFor="nom">Nom</label>
                        <input
                            id="nom"
                            type="text"
                            value={agent.nom}
                            onChange={(e) => { setAgent({ ...agent, nom: e.target.value }); setSuccess(''); }}
                            className="border rounded"
                        />

                        <label htmlFor="prenom">Prénom</label>
                        <input
                            id="prenom"
                            type="text"
                            value={agent.prenom}
                            onChange={(e) => { setAgent({ ...agent, prenom: e.target.value }); setSuccess(''); }}
                            className="border rounded"
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={agent.email}
                            onChange={(e) => { setAgent({ ...agent, email: e.target.value }); setSuccess(''); }}
                            className="border rounded"
                        />


                        <label htmlFor="role">Rôle</label>
                        <select
                            id="role"
                            value={agent.role}
                            onChange={(e) => { setAgent({ ...agent, role: e.target.value as 'UTILISATEUR' | 'ADMIN' }); setSuccess(''); }}
                            className="border rounded"
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
            </div>
        </PageLayout>
    );
}
