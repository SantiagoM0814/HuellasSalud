import { useState } from "react";
import axiosInstance from "../../context/axiosInstance";
import { Appointment, AppointmentData, Invoice, InvoiceData } from "../../helper/typesHS";
import { toast } from "react-toastify";
import { handleError } from "../../helper/utils";
import Swal from "sweetalert2";

export const useInvoiceService = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const apiInvoice = {
        getInvoices: async () => {
            const { data } = await axiosInstance.get<InvoiceData[]>(`/invoice/list-invoices`);
            return data
        },
        updateInvoice: async (invoice: Invoice) => {
            const dataUpdate = { data: invoice }
            await axiosInstance.put(`invoice/update`, dataUpdate)
        },
        deleteInvoice: async (invoice: Invoice) => {
            await axiosInstance.delete(`invoice/delete`, {
                params: {
                    idInvoice: invoice.idInvoice
                }
            })
        }
    }

    const handleGetInvoices = async () => {
        setLoading(true);
        toast.info("Cargando registros... ⌛", { autoClose: 1000 });

        try {
            const invoices: InvoiceData[] = await apiInvoice.getInvoices();
            toast.success("¡Registros cargados con éxito! 🎉", { autoClose: 1500 });
            return invoices;
        } catch (error) {
            handleError(error, "Error al consultar las facturas");
        } finally { setLoading(false); }
    }

    const handleUpdateInvoice = async (invoice: Invoice) => {
        setLoading(true);
        toast.info("Actualizando factura... ⌛", { autoClose: 1000 });
        try {
            await apiInvoice.updateInvoice(invoice);
            toast.success("Factura actualizada con éxito! 🎉", { autoClose: 1500 });
        } catch (error) {
            handleError(error, "Error al actualizar la factura");
        } finally { setLoading(false); }
    }

    const handleDeleteInvoice = async (invoice: Invoice) => {
        setLoading(true);
        toast.info("Eliminando factura... ⌛", { autoClose: 1000 });
        try {
            await apiInvoice.deleteInvoice(invoice);
            toast.success("Factura eliminada con éxito! 🎉", { autoClose: 1500 });
            return invoice.idInvoice;
        } catch (error) {
            handleError(error, "Error al eliminar la factura");
        } finally { setLoading(false); }
    }

    // const confirmUpdate = async (appointment: Appointment): Promise<boolean> => {
    //     const result = await Swal.fire({
    //         title: "¿Estás seguro?",
    //         text: `¿Deseas cambiar el estado de la cita a ${appointment.status ? "Inactivo" : "Activo"}?`,
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: `Actualizar estado de la cita`,
    //         cancelButtonText: "Cancelar",
    //     });
    //     if (result.isConfirmed) {
    //         appointment.status = !appointment.status;
    //         handleUpdateService(service);
    //         return true;
    //     }
    //     return false;
    // }

    const confirmDelete = async (invoice: Invoice): Promise<string | undefined> => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar la factura?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Si, eliminar factura`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) return handleDeleteInvoice(invoice);
    }

    return {
        loading,
        handleGetInvoices,
        confirmDelete
    }
}