import { useState } from "react";
import axiosInstance from "../../context/axiosInstance";
import { Product, ProductData } from "../../helper/typesHS";
import { toast } from "react-toastify";
import { handleError } from "../../helper/utils";
import Swal from "sweetalert2";

export const useProductService = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const apiProducts = {
        getProducts: async () => {
            const { data } = await axiosInstance.get<ProductData[]>(`/product/list-products`);
            return data
        }
    }

    const handleGetProducts = async () => {
        setLoading(true);
        toast.info("Cargando registros... ⌛", { autoClose: 1000 });

        try {
            const products: ProductData[] = await apiProducts.getProducts();
            toast.success("¡Registros cargador con éxito! 🎉", { autoClose: 1500 });
            return products;
        } catch (error) {
            handleError(error, "Error al consultar los productos");
        } finally { setLoading(false); }
    }

    return {
        loading,
        handleGetProducts
    }
}