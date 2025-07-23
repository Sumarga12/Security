import React, { useState, useEffect } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Appointment, User } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { appointmentsAPI } from '../src/api/appointments';
import { authAPI, UpdateProfileData } from '../src/api/auth';
import { useNotification } from '../contexts/NotificationContext.tsx';

const AppointmentCard: React.FC<{ appointment: Appointment; onCancel?: (id: string) => void }> = ({ appointment, onCancel }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Confirmed': return 'bg-blue-100 text-blue-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-2">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 text-left flex justify-between items-center">
                <div>
                    <p className="font-semibold text-[#4E443C]">{appointment.serviceName}</p>
                    <p className="text-sm text-gray-500">{appointment.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Remove appointment status tag */}
                    {/* <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>{appointment.status}</span> */}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : appointment.paymentStatus === 'Failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {appointment.paymentStatus}
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 border-t border-gray-200 bg-gray-50 text-[#166534]">
                            <p><strong>Time:</strong> {appointment.time}</p>
                            <p><strong>Appointment ID:</strong> {appointment._id || appointment.id}</p>
                            <p><strong>Total Price:</strong> Rs{appointment.totalPrice}</p>
                            <p><strong>Payment Status:</strong> {appointment.paymentStatus}</p>
                            {/* Cancel button only if not Cancelled or Completed */}
                            {onCancel && appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (appointment._id || appointment.id) && (
                                <button
                                    onClick={() => onCancel((appointment._id || appointment.id) as string)}
                                    className="mt-3 px-3 py-1 bg-red-500 text-white font-semibold rounded-lg text-xs hover:bg-red-600 transition"
                                >
                                    Cancel Appointment
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Profile: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const { addNotification } = useNotification();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setEditForm({
            name: user?.name || '',
            email: user?.email || ''
        });
    }, [user]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        if (selectedPhoto) {
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(selectedPhoto);
        } else {
            setPhotoPreview(null);
        }
    }, [selectedPhoto]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const userAppointments = await appointmentsAPI.getUserAppointments();
            setAppointments(userAppointments);
        } catch (error: any) {
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProfile = () => {
        setIsEditing(true);
        setEditForm({
            name: user?.name || '',
            email: user?.email || ''
        });
    };

    const handleSaveProfile = async () => {
        try {
            const response = await authAPI.updateProfile(editForm);
            updateUser(response.user);
            addNotification('Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (error: any) {
            addNotification(error.message || 'Failed to update profile', 'error');
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({
            name: user?.name || '',
            email: user?.email || ''
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedPhoto(e.target.files[0]);
        }
    };

    const handleUploadPhoto = async () => {
        if (!selectedPhoto) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('photo', selectedPhoto);
        try {
            const res = await fetch('/api/auth/profile-photo', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('homeglam_token')}`
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                addNotification('Profile photo updated!', 'success');
                updateUser({ ...user, profilePhoto: data.profilePhoto } as User);
                setSelectedPhoto(null);
            } else {
                addNotification(data.error || 'Failed to upload photo', 'error');
            }
        } catch (err) {
            addNotification('Failed to upload photo', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await appointmentsAPI.cancelAppointment(appointmentId);
                addNotification('Appointment cancelled successfully!', 'success');
                fetchAppointments(); // Refresh appointments after cancellation
            } catch (error: any) {
                addNotification(error.message || 'Failed to cancel appointment', 'error');
            }
        }
    };

    if (!user) return null;

    return (
        <AnimatedPage>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                            <img src={user.profilePhoto ? user.profilePhoto : `https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-[#22C55E]/50" />
                            <div className="flex-1 text-center md:text-left">
                                {/* Profile Photo Upload */}
                                <div className="mb-4">
                                    
                                    {photoPreview && (
                                        <div className="mt-2">
                                            <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto" />
                                            <button onClick={handleUploadPhoto} disabled={uploading} className="mt-2 px-4 py-2 bg-[#22C55E] text-white rounded-lg text-sm hover:bg-[#15803D] transition">
                                                {uploading ? 'Uploading...' : 'Upload Photo'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveProfile}
                                                className="px-4 py-2 bg-[#22C55E] text-white font-semibold rounded-lg text-sm hover:bg-[#15803D] transition flex items-center gap-1"
                                            >
                                                <CheckIcon className="w-4 h-4" />
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-lg text-sm hover:bg-gray-300 transition flex items-center gap-1"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h1 className="text-3xl font-serif font-bold text-black">{user.name}</h1>
                                        <p className="text-black/80 mt-1">{user.email}</p>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                            <button 
                                                onClick={handleEditProfile}
                                                className="px-4 py-2 bg-[#22C55E] text-white font-semibold rounded-lg text-sm hover:bg-[#15803D] transition flex items-center gap-1"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                            <Link to="/change-password">
                                                <button className="px-4 py-2 bg-gray-200 text-black font-semibold rounded-lg text-sm hover:bg-gray-300 transition">Change Password</button>
                                            </Link>
                                            <button onClick={logout} className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg text-sm hover:bg-red-200 transition">Logout</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div>
                            <h2 className="text-2xl font-serif text-[#4E443C] mb-6">Appointment History</h2>
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D97706] mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading appointments...</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-serif text-[#4E443C] mb-6">Appointment History</h2>
                            {appointments.length > 0 ? (
                                <div className="space-y-4">
                                    {appointments.map((app: Appointment) => (
                                        <AppointmentCard key={app._id || app.id} appointment={app} onCancel={handleCancelAppointment} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No appointments found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Profile;