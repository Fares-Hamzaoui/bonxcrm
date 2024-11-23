import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

export function AgencyManagement() {
 const [agencies, setAgencies] = useState([]);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentAgency, setCurrentAgency] = useState(null);
 const [formData, setFormData] = useState({
   name: '',
   location: '',
   email: '',
   phone: ''
 });

 useEffect(() => {
   loadAgencies();
 }, []);

 const loadAgencies = async () => {
   const snapshot = await getDocs(collection(db, 'agencies'));
   setAgencies(snapshot.docs.map(doc => ({
     id: doc.id,
     ...doc.data()
   })));
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     if (currentAgency) {
       await updateDoc(doc(db, 'agencies', currentAgency.id), formData);
     } else {
       await addDoc(collection(db, 'agencies'), {
         ...formData,
         createdAt: new Date(),
         status: 'active'
       });
     }
     setIsModalOpen(false);
     setCurrentAgency(null);
     setFormData({ name: '', location: '', email: '', phone: '' });
     loadAgencies();
   } catch (error) {
     console.error('Erreur:', error);
   }
 };

 const handleDelete = async (agencyId) => {
   if (window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
     try {
       await deleteDoc(doc(db, 'agencies', agencyId));
       loadAgencies();
     } catch (error) {
       console.error('Erreur:', error);
     }
   }
 };

 const openEditModal = (agency) => {
   setCurrentAgency(agency);
   setFormData({
     name: agency.name,
     location: agency.location,
     email: agency.email || '',
     phone: agency.phone || ''
   });
   setIsModalOpen(true);
 };

 return (
   <div className="mt-8">
     <div className="flex justify-between items-center mb-6">
       <h2 className="text-2xl font-bold text-gray-900">Gestion des Agences</h2>
       <button
         onClick={() => {
           setCurrentAgency(null);
           setFormData({ name: '', location: '', email: '', phone: '' });
           setIsModalOpen(true);
         }}
         className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
       >
         Ajouter une agence
       </button>
     </div>

     {/* Liste des agences */}
     <div className="bg-white shadow overflow-hidden rounded-lg">
       <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-gray-50">
           <tr>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Nom
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Localisation
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Contact
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
           {agencies.map(agency => (
             <tr key={agency.id}>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm font-medium text-gray-900">{agency.name}</div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm text-gray-500">{agency.location}</div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <div className="text-sm text-gray-500">
                   {agency.email && <div>{agency.email}</div>}
                   {agency.phone && <div>{agency.phone}</div>}
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                   {agency.status}
                 </span>
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                 <button
                   onClick={() => openEditModal(agency)}
                   className="text-blue-600 hover:text-blue-900 mr-4"
                 >
                   Modifier
                 </button>
                 <button
                   onClick={() => handleDelete(agency.id)}
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
                   {currentAgency ? 'Modifier l\'agence' : 'Nouvelle agence'}
                 </h3>
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
                   <div>
                     <label className="block text-sm font-medium text-gray-700">
                       Localisation
                     </label>
                     <input
                       type="text"
                       required
                       value={formData.location}
                       onChange={(e) => setFormData({...formData, location: e.target.value})}
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700">
                       Email
                     </label>
                     <input
                       type="email"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                     />
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
                   {currentAgency ? 'Mettre à jour' : 'Créer'}
                 </button>
                 <button
                   type="button"
                   onClick={() => {
                     setIsModalOpen(false);
                     setCurrentAgency(null);
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
