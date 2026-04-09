// update-password.tsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import '../index.css';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const cpUrl = params.get('cp') ?? '';
  const token = params.get('token');

  const navigate = useNavigate();

  useEffect(() => {
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || 'Erreur lors de la modification du mot de passe');
      } else {
        setSuccessMessage('Votre mot de passe a été mis à jour avec succès.');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="formContainer">
        <div className="pageIntro">
          <p className="pageEyebrow">Sécurité</p>
          <h1>Modifier votre mot de passe</h1>
          <p className="pageSubtitle">
            Choisissez un nouveau mot de passe pour finaliser la réinitialisation de votre compte.
          </p>
        </div>

        {error && <p className="errorMessage">{error}</p>}
        {successMessage && <p className="successMessage">{successMessage}</p>}

        <form onSubmit={handleUpdatePassword}>
          <label htmlFor="cp">CP</label>
          <input
            id="cp"
            type="text"
            value={cpUrl}
            disabled
          />

          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading} className="primaryButton">
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>

        <Link to="/login" className="helperLink">
          Retour à la connexion
        </Link>
      </div>
    </PageLayout>
  );
}
