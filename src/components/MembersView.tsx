import React, { useState } from 'react';
import { useAppState } from '../AppStateContext';
import { User, MembershipPlan } from '../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Eye, 
  UserPen, 
  Trash2, 
  Sparkles, 
  UserCheck, 
  X,
  Plus,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  BadgeAlert
} from 'lucide-react';

export const MembersView: React.FC = () => {
  const { users, deleteUser, updateUser, approveRenewal, plans } = useAppState();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'expiry'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected User drawer/modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form edit fields
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editMedical, setEditMedical] = useState('');
  const [editEmergencyName, setEditEmergencyName] = useState('');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState('');

  // Bulk actions checklist state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Filter out admins (this is the Member Directory)
  const directoryUsers = users.filter(u => u.role === 'member');

  // Search filter implementation
  const searchedUsers = directoryUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlan = planFilter === 'all' || user.planId === planFilter;
    const matchesGender = genderFilter === 'all' || user.gender === genderFilter;

    return matchesSearch && matchesStatus && matchesPlan && matchesGender;
  });

  // Sorting implementation
  const sortedUsers = [...searchedUsers].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'joinDate') {
      comparison = a.joinDate.localeCompare(b.joinDate);
    } else if (sortBy === 'expiry') {
      const expA = a.membershipExpiry || '';
      const expB = b.membershipExpiry || '';
      comparison = expA.localeCompare(expB);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (field: 'name' | 'joinDate' | 'expiry') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(currentItems.map(item => item.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectOne = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  // Genuine CSV Export Engine
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Join Date', 'Plan ID', 'Membership Expiry', 'Gender', 'Medical Info'];
    const rows = searchedUsers.map(u => [
      u.id,
      u.name,
      u.email,
      u.phone,
      u.status,
      u.joinDate,
      u.planId || 'None',
      u.membershipExpiry || 'None',
      u.gender,
      u.medicalInformation.replace(/,/g, ';') // escape commas
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "baroda_swimfront_members.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View Details trigger
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setEditingUser(null);
  };

  // Edit details trigger
  const handleEditInit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditMedical(user.medicalInformation);
    setEditEmergencyName(user.emergencyContactName);
    setEditEmergencyPhone(user.emergencyContactPhone);
    setSelectedUser(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: editName,
      email: editEmail,
      phone: editPhone,
      medicalInformation: editMedical,
      emergencyContactName: editEmergencyName,
      emergencyContactPhone: editEmergencyPhone
    });

    setEditingUser(null);
  };

  const handleBulkArchive = () => {
    selectedUserIds.forEach(id => deleteUser(id));
    setSelectedUserIds([]);
  };

  return (
    <div className="space-y-6" id="members-management-view">
      
      {/* Search and Filters panel */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        
        {/* Row 1: Search and Export */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-medium pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
              id="export-csv-btn"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            
            {selectedUserIds.length > 0 && (
              <button
                onClick={handleBulkArchive}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-red-200/50"
                id="bulk-archive-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Archive ({selectedUserIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Advanced filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-50">
          
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pass Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-600 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved & Active</option>
              <option value="pending">Review Pending</option>
              <option value="rejected">Rejected Accounts</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Membership Plan</label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-600 focus:outline-none"
            >
              <option value="all">All Plans</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gender Group</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-600 focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPlanFilter('all');
                setGenderFilter('all');
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-500 text-xs font-bold rounded-xl transition-all cursor-pointer border border-transparent"
            >
              Clear Filters
            </button>
          </div>

        </div>

      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={currentItems.length > 0 && selectedUserIds.length === currentItems.length}
                    className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100/50" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Member Name
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100/50" onClick={() => handleSort('joinDate')}>
                  <div className="flex items-center gap-1">
                    Join Date
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">Membership Plan</th>
                <th className="p-4 cursor-pointer hover:bg-slate-100/50" onClick={() => handleSort('expiry')}>
                  <div className="flex items-center gap-1">
                    Validity Expiry
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 text-xs">
                    No pool members found matching the specified parameters.
                  </td>
                </tr>
              ) : (
                currentItems.map((user) => {
                  const plan = plans.find(p => p.id === user.planId);
                  const isChecked = selectedUserIds.includes(user.id);
                  const isRenewalPending = user.status === 'approved' && user.medicalInformation.includes('[RENEWAL_PENDING');

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 text-slate-600 text-xs">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(user.id, e.target.checked)}
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center font-display font-bold shrink-0">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-medium text-[11px] text-slate-500">
                        {user.joinDate}
                      </td>
                      <td className="p-4">
                        {plan ? (
                          <span className="font-semibold text-slate-700">{plan.name}</span>
                        ) : (
                          <span className="text-slate-400">None Assigned</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-medium text-[11px] text-slate-500">
                        {user.membershipExpiry || 'N/A'}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase
                            ${user.status === 'approved' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : user.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }
                          `}>
                            {user.status}
                          </span>

                          {isRenewalPending && (
                            <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 text-[8px] font-bold rounded-md animate-pulse uppercase tracking-wider">
                              Renewal pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="p-1 text-slate-400 hover:text-cyan-600 rounded hover:bg-slate-100 cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditInit(user)}
                            className="p-1 text-slate-400 hover:text-cyan-600 rounded hover:bg-slate-100 cursor-pointer"
                            title="Edit Profile"
                          >
                            <UserPen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 cursor-pointer"
                            title="Permanently Archive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedUsers.length)} of {sortedUsers.length} members
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-mono text-slate-600 font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

      {/* DRAWER: VIEW DETAILS */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
                <h3 className="font-display font-bold text-slate-800 text-base">Member Dossier</h3>
                <button onClick={() => setSelectedUser(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-50 mb-5">
                {selectedUser.photoUrl ? (
                  <img src={selectedUser.photoUrl} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-cyan-50" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-display font-bold text-xl shrink-0">
                    {selectedUser.name.charAt(0)}
                  </div>
                )}
                <h4 className="font-display font-bold text-slate-800 mt-3 text-sm">{selectedUser.name}</h4>
                <p className="text-xs text-cyan-600 font-mono font-semibold mt-0.5">Member ID: {selectedUser.id}</p>
              </div>

              {/* Attributes lists */}
              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Joined Date</span>
                    <span className="font-bold text-slate-700 font-mono block mt-1">{selectedUser.joinDate}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expiry Date</span>
                    <span className="font-bold text-slate-700 font-mono block mt-1">{selectedUser.membershipExpiry || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Birth Date</span>
                    <span className="font-bold text-slate-700 font-mono block mt-1">{selectedUser.dateOfBirth || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gender Group</span>
                    <span className="font-bold text-slate-700 block mt-1">{selectedUser.gender}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Information</span>
                  <p className="font-bold text-slate-700 mt-1.5">Phone: <span className="font-semibold font-mono">{selectedUser.phone}</span></p>
                  <p className="font-bold text-slate-700 mt-1">Email: <span className="font-semibold">{selectedUser.email}</span></p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Contact</span>
                  <p className="font-bold text-slate-700 mt-1.5">Name: <span className="font-semibold">{selectedUser.emergencyContactName || 'N/A'}</span></p>
                  <p className="font-bold text-slate-700 mt-1">Phone: <span className="font-semibold font-mono">{selectedUser.emergencyContactPhone || 'N/A'}</span></p>
                </div>

                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-xs">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Medical History</span>
                  <p className="font-semibold text-slate-700 mt-1 leading-normal">
                    {selectedUser.medicalInformation.replace(/\[RENEWAL_PENDING:.*?\]/g, '').trim() || 'No flagged issues.'}
                  </p>
                </div>

                {/* If renewal is pending, allow approval right here! */}
                {selectedUser.medicalInformation.includes('[RENEWAL_PENDING') && (
                  <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-cyan-800">Renewal Requested</p>
                      <p className="text-[10px] text-cyan-600 mt-0.5">Admin review active.</p>
                    </div>
                    <button
                      onClick={() => {
                        approveRenewal(selectedUser.id);
                        setSelectedUser(null);
                      }}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Approve Renewal
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => handleEditInit(selectedUser)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPen className="w-4 h-4" />
                Edit Profile Information
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MEMBER PROFILE */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-display font-bold text-slate-800 text-base mb-1">Edit Member Dossier</h3>
            <p className="text-xs text-slate-400 font-medium mb-4">Modify account metadata, emergency lines, and medical history notes.</p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Member Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Emergency Name</label>
                  <input
                    type="text"
                    value={editEmergencyName}
                    onChange={(e) => setEditEmergencyName(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={editEmergencyPhone}
                    onChange={(e) => setEditEmergencyPhone(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Medical Flags / Notes</label>
                  <textarea
                    value={editMedical}
                    onChange={(e) => setEditMedical(e.target.value)}
                    rows={2}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
