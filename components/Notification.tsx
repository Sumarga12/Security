
import React, { useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const icons = {
    success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    error: <XCircleIcon className="h-6 w-6 text-red-500" />,
    info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

const colors = {
    success: 'bg-green-50 border-green-400',
    error: 'bg-red-50 border-red-400',
    info: 'bg-blue-50 border-blue-400',
}

const Notification: React.FC<{ id: number; message: string; type: 'success' | 'error' | 'info' }> = ({ id, message, type }) => {
    const { removeNotification } = useNotification();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeNotification(id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, removeNotification]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`relative flex items-start w-full max-w-sm p-4 overflow-hidden bg-white rounded-lg shadow-lg border-l-4 ${colors[type]}`}
        >
            <div className="flex-shrink-0">{icons[type]}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
            <button onClick={() => removeNotification(id)} className="ml-4 flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600"/>
            </button>
        </motion.div>
    );
};

const NotificationContainer: React.FC = () => {
    const { notifications } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
             <AnimatePresence>
                {notifications.map(n => (
                    <Notification key={n.id} id={n.id} message={n.message} type={n.type} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationContainer;
