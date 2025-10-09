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
        },
        updateProduct: async (product: Product) => {
            const dataUpdate = { data: product }
            await axiosInstance.put(`product/update`, dataUpdate)
        },
        deleteProduct: async (product: Product) => {
            await axiosInstance.delete(`product/delete`, {
                params: {
                    productId: product.idProduct
                }
            })
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

    const handleUpdateProduct = async (product: Product) => {
            setLoading(true);
            toast.info("Actualizando producto... ⌛", { autoClose: 1000 });
            try {
                await apiProducts.updateProduct(product);
                toast.success("¡Producto actualizado con éxito! 🎉", { autoClose: 1500 });
            } catch (error) {
                handleError(error, "Error al actualizar el producto");
            } finally { setLoading(false); }
        }
    
        const handleDeleteProduct = async (product: Product) => {
            setLoading(true);
            toast.info("Eliminando producto... ⌛", { autoClose: 1000 });
            try {
                await apiProducts.deleteProduct(product);
                toast.success("¡Producto eliminado con éxito! 🎉", { autoClose: 1500 });
                return product.idProduct;
            } catch (error) {
                handleError(error, "Error al eliminar el producto");
            } finally { setLoading(false); }
        }

    const confirmUpdate = async (product: Product): Promise<boolean> => {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Deseas cambiar el estado del producto: ${product.name} a ${product.active ? "Inactivo" : "Activo"}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Actualizar estado mascota`,
                cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) {
                product.active = !product.active;
                handleUpdateProduct(product);
                return true;
            }
            return false;
        }
    
        const confirmDelete = async (product: Product): Promise<string | undefined> => {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Deseas eliminar el producto: ${product.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Si, eliminar producto`,
                cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) return handleDeleteProduct(product);
        }

    return {
        loading,
        handleGetProducts,
        confirmUpdate,
        confirmDelete
    }
}