import { useState } from "react";
import { DynamicIcon } from "../dynamicIcons";
import { assetValidations } from "~/utils/apiAssets/validations";

interface CrearAssetModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (newAssetData: any) => void;
}

const CrearAssetModal: React.FC<CrearAssetModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombreAsset: "",
    numModelo: "",
    numSerie: "",
    marca: "",
    descripcion: "",
    capacidad: "",
    ubicacion: "",
    idCliente: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const maxLength = assetValidations[name as keyof typeof assetValidations]?.maxLength || 100;

    if (value.length <= maxLength) {
      setFormData({
        ...formData,
        [name]: type === "number" ? Number(value) : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const assetFinal = {
      ...formData,
      fechaRegistro: new Date().toISOString(), // Fecha actual en formato ISO
      estado: "En uso", // Estado por defecto
    };

    try {
      onSubmit(assetFinal); // Solo llamamos a onSubmit, sin hacer la petición aquí
      onClose();
    } catch (error) {
      console.error("Error al agregar el asset:", error);
    }
  };


  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-xl font-semibold text-black">Agregar asset</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <DynamicIcon iconName="X" className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Nombre del Asset", name: "nombreAsset" },
              { label: "Número de Modelo", name: "numModelo" },
              { label: "Número de Serie", name: "numSerie" },
              { label: "Marca", name: "marca" },
              { label: "Descripción", name: "descripcion" },
              { label: "Capacidad", name: "capacidad" },
              { label: "Ubicación", name: "ubicacion" },
            ].map((field) => (
              <div key={field.name} className="mb-3">
                <label className="block text-sm text-black">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleInputChange}
                  className="w-full p-2 border bg-slate-50 text-black rounded-md"
                  maxLength={assetValidations[field.name as keyof typeof assetValidations]?.maxLength}
                  required
                />
              </div>
            ))}
            <div className="mb-3">
              <label className="block text-sm text-black">Cliente</label>
              <input
                type="number"
                name="idCliente"
                value={formData.idCliente}
                onChange={handleInputChange}
                className="w-full p-2 border bg-slate-50 text-black rounded-md"
                
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-white p-2 rounded-lg mt-3">
            Agregar Asset
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearAssetModal;
