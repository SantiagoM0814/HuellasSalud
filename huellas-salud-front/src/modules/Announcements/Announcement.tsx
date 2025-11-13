import { useContext, useEffect, useMemo, useState } from "react";
import { AnnouncementData, AppointmentData, AuthContext, PetData, ProductData, ServiceData, User, UserData } from "../../helper/typesHS";
import { useAnnouncementsService } from "./announcementsService";
import styles from './announcement.module.css';
import Spinner from "../../components/spinner/Spinner";
import { useUserService } from "../Users/UserManagement/usersService";
import { usePetService } from "../Pets/petService";
import { useServiceService } from "../Services/servicesService";
import { AnnouncementModal, AnnouncementsFilters, AnnouncementTable } from "./announcementComponents";

const Announcement = () => {
  const [isModalCreateAnnouncement, setIsModalCreateAnnouncement] = useState<boolean>(false);
  const [announcementsData, setAnnouncementsData] = useState<AnnouncementData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(true);

  const { handleGetAnnouncements } = useAnnouncementsService();

  useEffect(() => {
    const fetchAnnouncementData = async () => {
      const data = await handleGetAnnouncements();
      setAnnouncementsData(data);

      setLoading(false);
    };

    fetchAnnouncementData();
  }, []);

  const filteredAnnouncement = useMemo(() => {
  if (!announcementsData) return [];

  return announcementsData.filter(({ data: announcement, meta }) => {
    // Manejo seguro de búsqueda
    const nameUser = meta?.nameUserCreated?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();

    // Coincidencia: si no hay búsqueda, incluye todos
    const matchesSearch = search === "" || nameUser.includes(search);

    // Filtro de estado
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && announcement.status) ||
      (statusFilter === "INACTIVE" && !announcement.status);

    return matchesSearch && matchesStatus;
  });
}, [announcementsData, searchTerm, statusFilter]);



  if (loading) return (<Spinner />);

  return (
    <main >
      <section className={styles.servicesSection}>
        <h1 className={styles.headerTitle}>Panel de administración - Anuncios</h1>
        <AnnouncementsFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          setModalCreateAnnouncement={setIsModalCreateAnnouncement}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />
        {(!announcementsData || announcementsData.length === 0) ? (
          <h2>No hay anuncios registrados</h2>
        ) : (
          <AnnouncementTable announcements={filteredAnnouncement} setAnnouncementsData={setAnnouncementsData}/>
        )}

        {isModalCreateAnnouncement && (<AnnouncementModal setModalCreateAnnouncement={setIsModalCreateAnnouncement} setAnnouncementsData={setAnnouncementsData} />)}
      </section>
    </main>
  )
}

export default Announcement;