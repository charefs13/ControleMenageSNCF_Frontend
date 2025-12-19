// update-password.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // si tu utilises react-router
import PageLayout from '../layouts/PageLayout';
import '../index.css';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Récupère params depuis l'URL : cp et token (token provient du lien envoyé par mail)
  const params = new URLSearchParams(window.location.search);
  const cpUrl = params.get('cp')
  const token = params.get('token')

  const navigate = useNavigate(); // pour rediriger après succès (si tu utilises react-router)

  useEffect(() => {
    // Si pas de token, on affiche une erreur immédiate (l'utilisateur doit réouvrir le lien email)
    if (!token) {
      setError('Lien invalide ou expiré. Merci de relancer la procédure de réinitialisation.');
    }
  }, [token]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!token) {
      setError('Token manquant. Rouvrez le lien envoyé par email.');
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const res = await fetch(`${API_URL}/auth/update-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // => le backend décode le token et récupère payload.sub
        },
        body: JSON.stringify({ mdp: password }), // backend attend "mdp"
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || 'Erreur lors de la modification du mot de passe');
      } else {
        setSuccessMessage('Votre mot de passe a été mis à jour avec succès.');
        // Optionnel : nettoyage / redirection après un court délai
        setTimeout(() => {
          // redirige vers la page de connexion
          navigate('/');
        }, 1800);
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="formContainer">
        <h1 className="">Modifier votre mot de passe</h1>

        {error && <p className="errorMessage">{error}</p>}
        {successMessage && <p className="successMessage">{successMessage}</p>}

        <form onSubmit={handleUpdatePassword}>
          {/* Champ CP affiché mais non modifiable */}
          <label htmlFor="cp">CP</label>
          <input
            id="cp"
            type="text"
            value={cpUrl}
            disabled
            className="border rounded bg-gray-100"
          />

          <label htmlFor="password" className="mb-1 font-medium">Nouveau mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded"
          />

          <label htmlFor="confirmPassword" className="mb-1 font-medium">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
