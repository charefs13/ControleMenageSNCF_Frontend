// reset-password.tsx

import { Link } from 'react-router-dom';
import { useState } from 'react';
import PageLayout from '../layouts/PageLayout';
import '../index.css';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email) {
            setError('Veuillez entrer votre adresse email');
            return;
        }

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
                setSuccessMessage('Si l\'utilisateur existe, un email de réinitialisation a été envoyé. Ce lien est valable 2 heures.');
                setEmail('');
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
                    <p className="pageEyebrow">Assistance compte</p>
                    <h1>Réinitialiser votre mot de passe</h1>
                    <p className="pageSubtitle">
                        Saisissez votre adresse professionnelle pour recevoir un lien de réinitialisation.
                    </p>
                </div>

                {error && <p className="errorMessage">{error}</p>}
                {successMessage && <p className="successMessage">{successMessage}</p>}
                <form onSubmit={handleResetPassword}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="prenom.nom@sncf.fr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="primaryButton"
                    >
                        {loading ? 'Envoie...' : 'Envoyer'}
                    </button>
                </form>

                <Link to="/login" className="helperLink">
                    Retour à la connexion
                </Link>
            </div>
        </PageLayout>
    );
}
