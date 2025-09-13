import { useEffect, useMemo, useState } from "react"
import { UserData } from "../../../helper/typesHS";
import { CreateUserModal, UserFilters, UserTable } from "./userComponents";
import { useUserService } from "./usersService";
import styles from "./users.module.css";

const Users = () => {

  const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
  const [usersData, setUsersData] = useState<UserData[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { handleGetUsers, loading } = useUserService();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await handleGetUsers();
      setUsersData(data);
    };

    fetchUserData();
  }, []);

  console.log(usersData);
  const filteredUsers = useMemo(() => {
    return usersData?.filter(({ data: user }) => {

      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase())
        || user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        || user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'ACTIVE' && user.active)
        || (statusFilter === 'INACTIVE' && !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersData, searchTerm, roleFilter, statusFilter]);

  if (loading) return (<div style={{ marginTop: "125px" }}>Cargando usuarios...</div>);

  return (
    <main className={styles.mainContainer}>
      <section className={styles.container}>
        <h1 className={styles.headerTitle}>Panel de administración - Usuarios</h1>
        <UserFilters
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          setModalCreateClose={setIsModalCreateOpen}
          onSearchChange={setSearchTerm}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <UserTable users={filteredUsers} setUsersData={setUsersData} />
        {isModalCreateOpen && (<CreateUserModal setModalCreate={setIsModalCreateOpen} setUsersData={setUsersData} />)}
      </section>
    </main>
  )
}

export default Users;