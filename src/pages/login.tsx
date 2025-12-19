// src/pages/Login.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import '../index.css';

export default function Login() {
  const navigate = useNavigate();

  // États pour le formulaire
  const [cp, setCp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Fonction de connexion
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
        credentials: 'include', // ⚠️ Ajouté pour que le cookie soit accepté si backend renvoie Set-Cookie
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

  // Acceptation des conditions
  const handleAcceptTerms = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/auth/terms`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ⚠️ pour envoyer le cookie automatiquement
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

  // Refus des conditions
  const handleDeclineTerms = () => {
    setShowTermsModal(false);
    setError('Vous devez accepter les conditions pour accéder à l’application.');
  };

  return (
    <PageLayout>
      <div className="formContainer">
        <h1>Connexion</h1>
        {error && <p className="errorMessage">{error}</p>}

        <form>
          <label htmlFor="cp">CP</label>
          <input
            id="cp"
            type="text"
            placeholder="0123456A"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            className="border rounded"
          />

          <label htmlFor="password" className="mb-1 font-medium">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded"
          />

          <div className="">
            <a href="./reset-password">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            onClick={handleLogin}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
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
