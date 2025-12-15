import { useState } from "react";
import axiosInstance from "../../context/axiosInstance";
import { Invoice, InvoiceData } from "../../helper/typesHS";
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
        getInvoicesUser: async (idUser: string) => {
            const { data } = await axiosInstance.get<InvoiceData[]>(`/invoice/list-invoices-client/${idUser}`);
            return data;
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
        toast.info("Cargando facturas... ⌛", { autoClose: 1000 });

        try {
            const invoices: InvoiceData[] = await apiInvoice.getInvoices();
            toast.success("Facturas cargadas con éxito! 🎉", { autoClose: 1500 });
            return invoices;
        } catch (error) {
            handleError(error, "Error al consultar las facturas");
        } finally { setLoading(false); }
    }

    const handleGetInvoicesUser = async (idUser: string) => {
        setLoading(true);
        toast.info("Cargando tus facturas... ⌛", { autoClose: 1000 });

        try {
            const invoices: InvoiceData[] = await apiInvoice.getInvoicesUser(idUser);
            toast.success("Facturas cargadas con éxito! 🎉", { autoClose: 1500 });
            return invoices;
        } catch (error) {
            handleError(error, "Error al consultar tus facturas");
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

    const confirmCancel = async (invoice: Invoice): Promise<boolean> => {
        const result = await Swal.fire({
            title: "¿Cancelar factura?",
            text: "Esta acción marcara la factura como CANCELADA",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Si, cancelar factura`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            invoice.status = "CANCELADA"
            handleUpdateInvoice(invoice);
            return true;
        }
        return false;
    }

    const confirmPay = async (invoice: Invoice): Promise<boolean> => {
        const result = await Swal.fire({
            title: "¿Marcar factura como pagada?",
            text: "Confirma que el cliente realizó el pago.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Si, marcar como pagada`,
            cancelButtonText: "Cancelar",
        });
        if (result.isConfirmed) {
            invoice.status = "PAGADA"
            handleUpdateInvoice(invoice);
            return true;
        }
        return false;
    }

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
        handleGetInvoicesUser,
        confirmDelete,
        confirmCancel,
        confirmPay
    }
}