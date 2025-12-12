// reset-password.tsx

import { useState } from 'react';
import PageLayout from '../layouts/PageLayout'; // Layout réutilisable avec header/footer
import '../index.css';  // Import du fichier CSS global (Tailwind, Bootstrap, etc.)

export default function ResetPassword() {
    // --- États du composant ---
    const [email, setEmail] = useState('');             // Stocke l'email
    const [error, setError] = useState('');            // Message d'erreur
    const [successMessage, setSuccessMessage] = useState(''); // Message succès
    const [loading, setLoading] = useState(false);     // Indique si une requête est en cours

    // --- Fonction appelée au submit du formulaire ---
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email) {
            setError('Veuillez entrer votre adresse email');
            return;
        }

        // Regex email SNCF
        const emailRegex = /^[A-Za-z0-9._%+-]+@sncf\.fr$/;
        if (!emailRegex.test(email)) {
            setError("Veuillez entrer une adresse email professionnelle terminant par @sncf.fr");
            return;
        }

        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Erreur lors de la réinitialisation du mot de passe');
            } else {
                setSuccessMessage('Un lien de réinitialisation a été envoyé. Ce lien est valide pendant 2 heures.');
                setEmail(''); // Optionnel : vider le champ email après succès
            }
        } catch {
            setError('Erreur réseau');
        } finally {
            setLoading(false);
        }
    };

    // --- Interface utilisateur ---
    return (
        <PageLayout>
            <div className="formContainer">
                <h1 className="fs-6 fw-bold mb-3 text-center w-100">Réinitialiser votre mot de passe</h1>

                {/* Affiche un message d'erreur */}
                {error && <p className="errorMessage">{error}</p>}

                {/* Affiche un message de succès */}
                {successMessage && <p className="successMessage">{successMessage}</p>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleResetPassword(e);
                    }}
                >
                    {/* Champ email */}
                    <label htmlFor="email">Email</label>
                    <input

                        id="email"
                        type="email"
                        placeholder="prenom.nom@sncf.fr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded"
                    />

                    {/* Bouton d'envoi */}
                    <button
                        type="submit"
                        onClick={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? 'Envoie...' : 'Envoyer'}
                    </button>
                </form>
            </div>
        </PageLayout>
    );
}
