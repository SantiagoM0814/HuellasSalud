import { useContext, useEffect, useMemo, useState } from "react";
import { AppointmentData, AuthContext, InvoiceData, PetData, ProductData, ServiceData, User, UserData } from "../../helper/typesHS";
import { useInvoiceService } from "./invoiceService";
import { InvoicesFilters, InvoiceTable } from "./invoiceComponents";
import styles from './invoice.module.css';
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { usePetService } from "../Pets/petService";
import { useServiceService } from "../Services/servicesService";
import { useProductService } from "../Products/productsService";

const Invoice = () => {
  const { user } = useContext(AuthContext);

  const [isModalCreateInvoice, setIsModalCreateInvoice] = useState<boolean>(false);
  const [invoicesData, setInvoicesData] = useState<InvoiceData[] | undefined>([]);
  const [usersData, setUsersData] = useState<UserData[] | undefined>([]);
  const [prodsData, setProdsData] = useState<ProductData[] | undefined>([]);
  const [petsData, setPetsData] = useState<PetData[] | undefined>([]);
  const [servicesData, setServicesData] = useState<ServiceData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { handleGetInvoices, loading } = useInvoiceService();
  const { handleGetUsers } = useUserService();
  const { handleGetPets } = usePetService();
  const { handleGetServices } = useServiceService();
  const { handleGetProducts } = useProductService();

  useEffect(() => {
    const fetchAppointmentData = async () => {
      const data = await handleGetInvoices();
      const dataUser = await handleGetUsers();
      const dataPet = await handleGetPets();
      const dataService = await handleGetServices();
      const dataProduct = await handleGetProducts();

      setInvoicesData(data);
      setUsersData(dataUser);
      setPetsData(dataPet);
      setServicesData(dataService);
      setProdsData(dataProduct);
    };

    fetchAppointmentData();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoicesData?.filter(({ data: invoice }) => {
      const matchesSearch = invoice.idInvoice.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'PENDIENTE' && invoice.status)
        || (statusFilter === 'FINALIZADA' && !invoice.status);

      return matchesSearch && matchesStatus;
    })
  }, [invoicesData, searchTerm, statusFilter]);

  if (loading) return (<Spinner/>);

  return (
    <main >
      <section className={styles.servicesSection}>
        {user?.role == "CLIENTE" ? (
          <h1 className={styles.headerTitle}>Historial de facturación</h1>
        ) : (
          <h1 className={styles.headerTitle}>Panel de administración - Facturas</h1>
        )}
        <InvoicesFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          setModalCreateInvoice={setIsModalCreateInvoice}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />
        <InvoiceTable invoices={filteredInvoices} setInvoicesData={setInvoicesData} users={usersData} services={servicesData} pets={petsData} prods={prodsData}/>
        {/* {isModalCreateAppointment && (<AppointmentModal setModalAppointment={setIsModalCreateAppointment} setAppointmentsData={setAppointmentsData} users={usersData} services={servicesData} pets={petsData} vets={vetsData}/>)} */}
      </section>
    </main>
  )
}

export default Invoice;