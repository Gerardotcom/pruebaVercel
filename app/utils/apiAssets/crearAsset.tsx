export const agregarAsset = async (newAssetData: any) => {
  try {
      const response = await fetch("https://localhost:7236/api/Assets/Agregar", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(newAssetData),
      });

      if (!response.ok) {
          throw new Error("Error al agregar el asset");
      }

      return await response.json();
  } catch (error) {
      console.error("Error al agregar el asset:", error);
      throw error;
  }
};