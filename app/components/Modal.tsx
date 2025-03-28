import React from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    onConfirm?: () => void; // <-- El ? hace que sea opcional
    onCancel: () => void;
    type: "confirm" | "alert";
  };
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message, onConfirm, onCancel, type }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="w-xl flex flex-col items-center text-slate-800 bg-slate-100 p-6 rounded-2xl shadow-lg">
                <h1 className="text-primary text-3xl font-bold text-center pt-4 pb-8">
                    {type === 'confirm' ? 'Confirmación' : 'Aviso'}
                </h1>
                <p className="px-8 mb-4 font-semibold">{message}</p>
                <div className="mt-4 flex justify-end space-x-4">
                    {type === 'confirm' ? (
                        <>
                            <button
                                onClick={onConfirm}
                                className="w-12 bg-primary text-center text-white py-2 rounded-lg"
                            >
                                Sí
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-12 bg-slate-600 text-center text-white py-2 rounded-lg"
                            >
                                No
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-24 bg-primary text-center text-white py-2 rounded-lg"
                        >
                            Aceptar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

