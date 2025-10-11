import { useState } from "react";
import axiosInstance from "../../context/axiosInstance";
import { Product, ProductData, Service, ServiceData } from "../../helper/typesHS";
import { toast } from "react-toastify";
import { handleError } from "../../helper/utils";
import Swal from "sweetalert2";

export const useServiceService = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const apiServices = {
        getServices: async () => {
            const { data } = await axiosInstance.get<ServiceData[]>(`/service/list-services`);
            return data
        },
        updateService: async (service: Service) => {
            const dataUpdate = { data: service }
            await axiosInstance.put(`product/update`, dataUpdate)
        },
        deleteService: async (service: Service) => {
            await axiosInstance.delete(`product/delete`, {
                params: {
                    idService: service.idService
                }
            })
        }
    }

    const handleGetServices = async () => {
        setLoading(true);
        toast.info("Cargando registros... ⌛", { autoClose: 1000 });

        try {
            const services: ServiceData[] = await apiServices.getServices();
            toast.success("¡Registros cargados con éxito! 🎉", { autoClose: 1500 });
            return services;
        } catch (error) {
            handleError(error, "Error al consultar los servicios");
        } finally { setLoading(false); }
    }

    const handleUpdateService = async (service: Service) => {
            setLoading(true);
            toast.info("Actualizando servicio... ⌛", { autoClose: 1000 });
            try {
                await apiServices.updateService(service);
                toast.success("Servicio actualizado con éxito! 🎉", { autoClose: 1500 });
            } catch (error) {
                handleError(error, "Error al actualizar el servicio");
            } finally { setLoading(false); }
        }
    
        const handleDeleteService = async (service: Service) => {
            setLoading(true);
            toast.info("Eliminando servicio... ⌛", { autoClose: 1000 });
            try {
                await apiServices.deleteService(service);
                toast.success("Servicio eliminado con éxito! 🎉", { autoClose: 1500 });
                return service.idService;
            } catch (error) {
                handleError(error, "Error al eliminar el servicio");
            } finally { setLoading(false); }
        }

    const confirmUpdate = async (service: Service): Promise<boolean> => {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Deseas cambiar el estado del servicio: ${service.name} a ${service.state ? "Inactivo" : "Activo"}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Actualizar estado del servicio`,
                cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) {
                service.state = !service.state;
                handleUpdateService(service);
                return true;
            }
            return false;
        }
    
        const confirmDelete = async (service: Service): Promise<string | undefined> => {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Deseas eliminar el servicio: ${service.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Si, eliminar servicio`,
                cancelButtonText: "Cancelar",
            });
            if (result.isConfirmed) return handleDeleteService(service);
        }

    return {
        loading,
        handleGetServices,
        confirmUpdate,
        confirmDelete
    }
}