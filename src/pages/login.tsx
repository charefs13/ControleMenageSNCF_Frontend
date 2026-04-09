// src/pages/Login.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import '../index.css';

export default function Login() {
  const navigate = useNavigate();

  const [cp, setCp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cp || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const cpRegex = /^\d{7}[A-Z]$/; // Vérifie 7 chiffres + majuscule
    if (!cpRegex.test(cp)) {
      setError("Le CP doit contenir 7 chiffres suivis d’une lettre majuscule");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cp, mdp: password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de la connexion');
      } else {
        if (data.acceptedTerms) {
          navigate('/mainPage');
        } else {
          setShowTermsModal(true);
        }
      }
    } catch {
      setError('Erreur réseau');
    }

    setLoading(false);
  };

  const handleAcceptTerms = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/auth/terms`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de l’acceptation des conditions');
        return;
      }

      setShowTermsModal(false);
      navigate('/mainPage');
    } catch {
      setError('Erreur réseau');
    }
  };

  const handleDeclineTerms = () => {
    setShowTermsModal(false);
    setError('Vous devez accepter les conditions pour accéder à l’application.');
  };

  return (
    <PageLayout>
      <div className="formContainer">
        <div className="pageIntro">
          <p className="pageEyebrow">Accès sécurisé</p>
          <h1>Connexion</h1>
          <p className="pageSubtitle">
            Connectez-vous pour accéder au contrôle de conformité et aux actions d'habilitation.
          </p>
        </div>

        {error && <p className="errorMessage">{error}</p>}

        <form onSubmit={handleLogin}>
          <label htmlFor="cp">CP</label>
          <input
            id="cp"
            type="text"
            placeholder="0123456A"
            value={cp}
            onChange={(e) => setCp(e.target.value.toUpperCase())}
            autoComplete="username"
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Link to="/reset-password" className="helperLink">
            Mot de passe oublié ?
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="primaryButton"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* --- Overlay + Modale --- */}
        {showTermsModal && <div className="modalOverlay"></div>}

        {showTermsModal && (
          <div className="modalContainer">
            <h2>Conditions d'utilisation</h2>
            <div className="modalContent">
              <p>
                En utilisant cette application, vous acceptez que les données collectées soient exploitées exclusivement dans le cadre de la gestion et du contrôle de ménage de la SNCF.
              </p>
              <p>
                Ces informations resteront confidentielles et seront uniquement accessibles aux personnels autorisés de la SNCF.
              </p>
            </div>
            <div className="btnContainer">
              <button type="button" className="accepte" onClick={handleAcceptTerms}>J'accepte</button>
              <button type="button" className="decline" onClick={handleDeclineTerms}>Je refuse</button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
