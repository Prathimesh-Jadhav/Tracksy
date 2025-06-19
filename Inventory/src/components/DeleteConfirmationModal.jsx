import React from 'react';
import { MdWarning, MdClose } from 'react-icons/md';

const DeleteConfirmationModal = ({ 
    openDeleteModal, 
    setOpenDeleteModal, 
    setOnConfirmDelete, 
    title = "Delete Item", 
    message = "Are you sure you want to delete this item?",
    confirmText = "Delete",
    cancelText = "Cancel",
    itemName = "" 
}) => {

    const handleConfirm = () => {
        setOnConfirmDelete(true);
    };

    const handleCancel = () => {
        setOnConfirmDelete(false);
        setOpenDeleteModal(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    if (!openDeleteModal) return null;

    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 bg-black bg-opacity-40 p-4 transition-all duration-300 ${
                openDeleteModal ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            onClick={handleBackdropClick}
        >
            <div 
                className={`max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ${
                    openDeleteModal ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full">
                            <MdWarning className="text-red-600 dark:text-red-400" size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                        <MdClose className="text-gray-500 dark:text-gray-400" size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {message}
                        {itemName && (
                            <span className="block mt-2 font-medium text-gray-900 dark:text-white">
                                "{itemName}"
                            </span>
                        )}
                    </p>
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-300">
                            ⚠️ This action cannot be undone. The item will be permanently removed.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;