import { useState } from 'react';
import PageLayout from '../layouts/PageLayout';

export default function AddAuthorization() {
  const [cp, setCp] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'UTILISATEUR' | 'ADMIN'>('UTILISATEUR');

  const [error, setError] = useState(''); // erreurs serveur
  const [success, setSuccess] = useState(''); // message succès
  const [fieldErrors, setFieldErrors] = useState({
    cp: '',
    nom: '',
    prenom: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // On réinitialise l'état de validation à chaque tentative pour garder un
    // retour utilisateur lisible et éviter les erreurs obsolètes.
    setFieldErrors({ cp: '', nom: '', prenom: '', email: '' });
    setError('');
    setSuccess('');

    let hasError = false;
    const newFieldErrors = { cp: '', nom: '', prenom: '', email: '' };

    if (!cp) { newFieldErrors.cp = 'Veuillez remplir ce champ'; hasError = true; }
    else if (!/^\d{7}[A-Z]$/.test(cp)) {
      newFieldErrors.cp = 'Le CP doit contenir 7 chiffres suivis d’une lettre majuscule'; 
      hasError = true;
    }

    if (!nom) { newFieldErrors.nom = 'Veuillez remplir ce champ'; hasError = true; }
    if (!prenom) { newFieldErrors.prenom = 'Veuillez remplir ce champ'; hasError = true; }
    if (!email) {
      newFieldErrors.email = 'Veuillez remplir ce champ'; 
      hasError = true;
    } else if (!/^[A-Za-z0-9._%+-]+@sncf\.fr$/.test(email)) {
      newFieldErrors.email = 'L’email doit se terminer par @sncf.fr'; 
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cp, nom, prenom, email, role }),
        credentials: 'include', // envoie le cookie avec le token
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de la création');
      } else {
        setSuccess(`Utilisateur ${nom} ${prenom} créé avec succès !`);

        setCp('');
        setNom('');
        setPrenom('');
        setEmail('');
        setRole('UTILISATEUR');
      }
    } catch {
      setError('Erreur réseau');
    }

    setLoading(false);
  };

  return (
    <PageLayout requireAuth requiredRole="ADMIN">
      <section className="dashboardGrid pageSection">
        <div className="dashboardHero">
          <div className="pageIntro">
            <p className="pageEyebrow">Administration</p>
            <h1>Créer une habilitation</h1>
            <p className="pageSubtitle">
              Ajoutez un collaborateur et définissez son niveau d'accès.
            </p>
          </div>

          <div className="infoGrid">
            <div className="infoCard">
              <strong>Création du compte</strong>
              La création enregistre l&apos;utilisateur avec son CP, son email professionnel
              et son rôle d&apos;accès dans l&apos;application.
            </div>
            <div className="infoCard">
              <strong>Invitation automatique</strong>
              Un email est envoyé automatiquement au collaborateur pour lui permettre
              de créer son mot de passe via un lien sécurisé.
            </div>
            <div className="infoCard">
              <strong>Points de vigilance</strong>
              Le CP doit respecter le format attendu et l&apos;email doit se terminer
              par `@sncf.fr`. Un CP ou un email déjà existant sera refusé.
            </div>
          </div>
        </div>

        <div className="formContainer">
          {error && <p className="errorMessage">{error}</p>}
          {success && <p className="successMessage">{success}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="cp">CP</label>
            <input
              id="cp"
              type="text"
              placeholder="0123456A"
              value={cp}
              onChange={(e) => {
                setCp(e.target.value.toUpperCase());
                setFieldErrors({ ...fieldErrors, cp: '' });
                setSuccess('');
              }}
            />
            {fieldErrors.cp && <p className="errorMessage">{fieldErrors.cp}</p>}

            <label htmlFor="nom">Nom</label>
            <input
              id="nom"
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
                setFieldErrors({ ...fieldErrors, nom: '' });
                setSuccess('');
              }}
            />
            {fieldErrors.nom && <p className="errorMessage">{fieldErrors.nom}</p>}

            <label htmlFor="prenom">Prénom</label>
            <input
              id="prenom"
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => {
                setPrenom(e.target.value);
                setFieldErrors({ ...fieldErrors, prenom: '' });
                setSuccess('');
              }}
            />
            {fieldErrors.prenom && <p className="errorMessage">{fieldErrors.prenom}</p>}

            <label htmlFor="email">Email professionnel</label>
            <input
              id="email"
              type="email"
              placeholder="prenom.nom@sncf.fr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors({ ...fieldErrors, email: '' });
                setSuccess('');
              }}
            />
            {fieldErrors.email && <p className="errorMessage">{fieldErrors.email}</p>}

            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'UTILISATEUR' | 'ADMIN')}
            >
              <option value="UTILISATEUR">Utilisateur</option>
              <option value="ADMIN">Administrateur</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="primaryButton"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </form>
        </div>
      </section>
    </PageLayout>
  );
}
