import { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agencyId: '',
    phone: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Charger les agences
    const agenciesSnapshot = await getDocs(collection(db, 'agencies'));
    const agenciesData = agenciesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setAgencies(agenciesData);

    // Charger les administrateurs
    const adminsQuery = query(collection(db, 'users'), where('role', '==', 'admin'));
    const adminsSnapshot = await getDocs(adminsQuery);
    const adminsData = adminsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setAdmins(adminsData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (currentAdmin) {
        // Mise à jour d'un admin existant
        await updateDoc(doc(db, 'users', currentAdmin.id), {
          name: formData.name,
          agencyId: formData.agencyId,
          phone: formData.phone,
          updatedAt: new Date()
        });
      } else {
        // Création d'un nouvel admin
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await addDoc(collection(db, 'users'), {
          uid: userCredential.user.uid,
          name: formData.name,
          email: formData.email,
          role: 'admin',
          agencyId: formData.agencyId,
          phone: formData.phone,
          status: 'active',
          createdAt: new Date()
        });
      }
      setIsModalOpen(false);
      setCurrentAdmin(null);
      setFormData({ name: '', email: '', password: '', agencyId: '', phone: '' });
      loadData();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };
  const handleDelete = async (admin) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      try {
        await deleteDoc(doc(db, 'users', admin.id));
        loadData();
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
      }
    }
  };

  const openEditModal = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      agencyId: admin.agencyId || '',
      phone: admin.phone || '',
      password: ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Administrateurs</h2>
        <button
          onClick={() => {
            setCurrentAdmin(null);
            setFormData({ name: '', email: '', password: '', agencyId: '', phone: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Ajouter un administrateur
        </button>
      </div>

      {/* Liste des administrateurs */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                  {admin.phone && (
                    <div className="text-sm text-gray-500">{admin.phone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{admin.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {agencies.find(a => a.id === admin.agencyId)?.name || 'Non assigné'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(admin)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(admin)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
{/* Modal d'ajout/modification */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currentAdmin ? 'Modifier l\'administrateur' : 'Nouvel administrateur'}
                  </h3>
                  
                  {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="text-red-700">{error}</div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>

                    {!currentAdmin && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mot de passe
                          </label>
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Agence
                      </label>
                      <select
                        value={formData.agencyId}
                        onChange={(e) => setFormData({...formData, agencyId: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      >
                        <option value="">Sélectionner une agence</option>
                        {agencies.map(agency => (
                          <option key={agency.id} value={agency.id}>
                            {agency.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentAdmin ? 'Mettre à jour' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentAdmin(null);
                      setError('');
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
