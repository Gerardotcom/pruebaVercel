import React, { useState } from "react";
import { X } from "lucide-react"; // Asegúrate de tener este icono disponible
import { assetValidations } from "~/utils/apiAssets/validations";

const EditarAssetModal = ({ asset, isVisible, onClose, onSubmit }: any) => {
    const [nombreAsset, setNombreAsset] = useState(asset.nombreAsset);
    const [descripcion, setDescripcion] = useState(asset.descripcion);
    const [ubicacion, setUbicacion] = useState(asset.ubicacion);
    const [capacidad, setCapacidad] = useState(asset.capacidad);

    const handleSubmit = () => {
        const updatedAssetData = { nombreAsset, descripcion, ubicacion, capacidad };
        onSubmit(updatedAssetData); // Enviar los datos actualizados
    };

    if (!isVisible) return null;

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            const maxLength = assetValidations[field as keyof typeof assetValidations]?.maxLength || 100;
    
            if (value.length <= maxLength) {
                setter(value);
            }
        };    

    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl w-96">
                <div className="flex justify-between items-center border-b pb-2 my-2">
                    <h2 className="align-middle text-xl font-semibold text-black">Editar Asset</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-black">Nombre del Asset</label>
                    <input
                        type="text"
                        value={nombreAsset}
                        onChange={(e) => setNombreAsset(e.target.value)}
                        className="w-full bg-slate-50 text-black p-2 border border-gray-300 rounded"
                        maxLength={assetValidations.nombreAsset.maxLength}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black">Descripción</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full bg-slate-50 text-black p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black">Ubicación</label>
                    <input
                        type="text"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        className="w-full bg-slate-50 text-black p-2 border border-gray-300 rounded"
                        maxLength={assetValidations.ubicacion.maxLength}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-black">Capacidad</label>
                    <input
                        type="text"
                        value={capacidad}
                        onChange={(e) => setCapacidad(e.target.value)}
                        className="w-full bg-slate-50 text-black p-2 border border-gray-300 rounded"
                        maxLength={assetValidations.capacidad.maxLength}
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full bg-primary text-white p-2 rounded-lg"
                >
                    Guardar cambios
                </button>
            </div>
        </div>
    );
};

export default EditarAssetModal;
