//login.tsx

import { useState } from 'react';
import PageLayout from '../layouts/PageLayout'; // Layout réutilisable avec header/footer
import '../index.css';  // Import du fichier CSS global (Tailwind, Bootstrap, etc.)

export default function Login() {
  // --- États du composant ---
  const [cp, setCp] = useState('');           // Stocke le CP
  const [password, setPassword] = useState(''); // Stocke le mot de passe
  const [error, setError] = useState('');     // Message d'erreur
  const [loading, setLoading] = useState(false); // Indique si une requête est en cours


  // --- Fonction appelée au clic sur "Se connecter" ---
 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

    if (!cp || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Regex CP : 7 chiffres suivis d'une lettre majuscule
    const cpRegex = /^\d{7}[A-Z]$/;
    if (!cpRegex.test(cp)) {
      setError("Le CP doit contenir 7 chiffres suivis d’une lettre majuscule");
      return;
    }

    setError("");
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cp, mdp: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de la connexion');
      } else {
        localStorage.setItem('token', data.accessToken);
        console.log('Connexion réussie, token stocké');
        // Ici tu peux rediriger vers la page principale
      }
    } catch {
      setError('Erreur réseau');
    }
    setLoading(false);
  };

  // --- Interface utilisateur ---
  return (
    <PageLayout>
      {/* Formulaire centré */}
      <div className="formContainer">
        <h1>Connexion</h1>

        {/* Affiche un message d'erreur */}
        {error && <p className="errorMessage">{error}</p>}
        <form>
          {/* Champ CP */}
          <label htmlFor="cp">CP</label>
          <input
            id="cp"
            type="text"
            placeholder="0123456A"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            className="border rounded"
          />

          {/* Champ mot de passe */}
          <label htmlFor="password" className="mb-1 font-medium">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded"
          />

          {/* Lien "mot de passe oublié" */}
          <div className="flex justify-end mb-4">
            <a href='./reset-password'>
              Mot de passe oublié ?
            </a>
          </div>

          {/* Bouton de connexion */}
          <button
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </PageLayout>
  );
}
