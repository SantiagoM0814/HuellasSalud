import styles from './services.module.css';
import defaultServiceImg from '../../assets/default_service.png';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Service, ServiceCardProps, ServiceData } from '../../helper/typesHS';
import { useServiceService } from './servicesService';
import { formatCurrencyCOP } from '../../helper/formatter.ts';
import { SearchBar } from './serviceComponents.tsx';
import Spinner from '../../components/spinner/Spinner.tsx';
import { AppointmentModal } from '../Appointments/appointmentComponents.tsx';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [servicesData, setServicesData] = useState<ServiceData[] | undefined>([]);

  const { loading, handleGetServices } = useServiceService();

  useEffect(() => {
    const fetchProductData = async () => {
      let data = await handleGetServices();
      setServicesData(data);
    }
    fetchProductData();
  }, []);

  const handlerFormatCoin = (precio: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(precio);
  }

  const filteredServices = useMemo(() => {
    return servicesData?.filter(({ data: service }) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch;
    })
  }, [servicesData, searchTerm]);
  
  if (loading) return (<Spinner />);

  return (
    <main className={styles.containServices}>
      <section className={styles.filters}>
        <SearchBar
          placeholder="Buscar servicio..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </section>
      <section className={styles.serviceCardContainer}>
        <ServiceCard services={filteredServices} />
      </section>
    </main>
  );
}

const ServiceCard = ({ services }: { services?: ServiceData[] }) => {
  const [modalAppointment, setModalAppointment] = useState<boolean>(false);
  const [serviceSelected, setServiceSelected] = useState<string>();
  if (!services || services.length === 0) {
    return <h2>No hay servicios registrados</h2>;
  }

  const handleModal = (idService: string) => {
    setModalAppointment(prev => !prev);
    setServiceSelected(idService);
  }

  return (
    <main className={styles.cardServicesContainer}>
      {services?.filter(({ data: service }) => service.state)
        .map(({ data: service}) => (
        <section className={styles.cardService} key={service.idService}>
          <aside className={styles.imgCardService}>
            <img
              src={getServiceImage(service)}
              alt={service.name}
              className={styles.cardImage}
            />
          </aside>

          <aside className={styles.nameService}>
            <h3>{service.name}</h3>
          </aside>

          <p className={styles.description}>{service.shortDescription}</p>
          <span className={styles.price}>
            {service.priceByWeight
              ? `Desde ${formatCurrencyCOP(service.basePrice)} • Precio según peso`
              : `Precio fijo: ${formatCurrencyCOP(service.basePrice)}`}
          </span>
          <button className={styles.btnAppointment} onClick={() => handleModal(service.idService)}>Agendar Cita</button>
        </section>
      ))}
      {modalAppointment && (
        <AppointmentModal setModalAppointment={setModalAppointment} selectedServiceId={serviceSelected} services={services}/>
      )}
    </main>
  );
};

const getServiceImage = (service: Service) => {
  if (service.mediaFile) {
    return `data:${service.mediaFile.contentType};base64,${service.mediaFile.attachment}`;
  }
  return defaultServiceImg;
}

export default Services;