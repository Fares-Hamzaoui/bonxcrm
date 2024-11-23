import { useState, useEffect } from 'react';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AgencyManagement } from '../../components/agencies/AgencyManagement';
import { AdminManagement } from '../../components/admins/AdminManagement';

export default function SuperAdminDashboard() {
 const [stats, setStats] = useState({
   totalAgences: 0,
   totalAdmins: 0,
   totalUsers: 0
 });

 useEffect(() => {
   loadStats();
 }, []);

 const loadStats = async () => {
   const agencesSnap = await getDocs(collection(db, 'agencies'));
   const usersSnap = await getDocs(collection(db, 'users'));
   
   const admins = usersSnap.docs.filter(doc => doc.data().role === 'admin');

   setStats({
     totalAgences: agencesSnap.docs.length,
     totalAdmins: admins.length,
     totalUsers: usersSnap.docs.length
   });
 };

 return (
   <div className="min-h-screen bg-gray-50">
     <DashboardHeader />
     
     <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
       {/* Cartes de statistiques */}
       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
         <div className="bg-white overflow-hidden shadow rounded-lg">
           <div className="p-5">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                 <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                 </svg>
               </div>
               <div className="ml-5 w-0 flex-1">
                 <dl>
                   <dt className="text-sm font-medium text-gray-500 truncate">Agences</dt>
                   <dd className="text-3xl font-semibold text-gray-900">{stats.totalAgences}</dd>
                 </dl>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-white overflow-hidden shadow rounded-lg">
           <div className="p-5">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                 <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                 </svg>
               </div>
               <div className="ml-5 w-0 flex-1">
                 <dl>
                   <dt className="text-sm font-medium text-gray-500 truncate">Administrateurs</dt>
                   <dd className="text-3xl font-semibold text-gray-900">{stats.totalAdmins}</dd>
                 </dl>
               </div>
             </div>
           </div>
         </div>

         <div className="bg-white overflow-hidden shadow rounded-lg">
           <div className="p-5">
             <div className="flex items-center">
               <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                 <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
               </div>
               <div className="ml-5 w-0 flex-1">
                 <dl>
                   <dt className="text-sm font-medium text-gray-500 truncate">Utilisateurs totaux</dt>
                   <dd className="text-3xl font-semibold text-gray-900">{stats.totalUsers}</dd>
                 </dl>
               </div>
             </div>
           </div>
         </div>
       </div>

       <div className="mt-8">
         <AgencyManagement />
       </div>

       <div className="mt-8">
         <AdminManagement />
       </div>
     </main>
   </div>
 );
}
