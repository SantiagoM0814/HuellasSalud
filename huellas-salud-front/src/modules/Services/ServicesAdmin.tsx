import { useEffect, useMemo, useState } from "react";
import { ServiceData } from "../../helper/typesHS";
import { useServiceService } from "./servicesService";
import { ServiceFilters, ServiceModal, ServiceTable } from "./serviceComponents";
import styles from './servicesAdmin.module.css';
import Spinner from "../../components/spinner/Spinner";

const ServicesAdmin = () => {
  const [isModalCreateService, setIsModalCreateService] = useState<boolean>(false);
  const [servicesData, setServicesData] = useState<ServiceData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { handleGetServices, loading} = useServiceService();
  
  useEffect(() => {
    const fetchServiceData = async () => {
      const data = await handleGetServices();
      setServicesData(data)
    };

    fetchServiceData();
  }, []);

  const filteredServices = useMemo(() => {
    return servicesData?.filter(({ data: service}) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'ACTIVE' && service.state)
        || (statusFilter === 'INACTIVE' && !service.state);

      return matchesSearch && matchesStatus;
    })
  }, [servicesData, searchTerm, statusFilter]);

  if (loading) return (<Spinner />);

  return (
    <main >
      <section className={styles.servicesSection}>
        <h1 className={styles.headerTitle}>Panel de administración - Servicios</h1>
        <ServiceFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          setModalCreateService={setIsModalCreateService}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />
        <ServiceTable services={filteredServices} setServicesData={setServicesData}/>
        {isModalCreateService && (<ServiceModal setModalService={setIsModalCreateService} setServicesData={setServicesData} />)}
      </section>
    </main>
  )
}

export default ServicesAdmin;