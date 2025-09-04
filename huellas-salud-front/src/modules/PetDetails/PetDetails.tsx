import { useEffect, useState } from "react";
import { PetDetails } from "./petDetailsComponents";
import { usePetDetailsService } from "./petDetailsService";
import { PetData } from "../../helper/typesHS";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./petDetails.module.css"

const Pet = () => {
    const navigate = useNavigate();

    const { idPet } = useParams<{ idPet: string }>();
    const [petData, setPetData] = useState<PetData | undefined>();
    const {handleGetPet, loading} = usePetDetailsService();

    console.log(idPet, "el id de la mascota es");

    useEffect(() => {
        if (!idPet) return;
        const fetchPetData = async () => {
            const data = await handleGetPet(idPet);
            setPetData(data);
        };

        fetchPetData();
    }, []);

    if (loading) return (<div style={{ marginTop: "125px" }}>Cargando mascota...</div>);


    return (
      <main className={styles.mhMain}>
        <section>
          <button className={styles.btnBackHistory} onClick={() => navigate("/mascotas")}><i className="fa-solid fa-arrow-left" /> Volver</button>
          {petData ? (
            <PetDetails pet={petData} />
          ) : (
            <div style={{ marginTop: "125px" }}>No se encontró la mascota</div>
          )}
        </section>
      </main>
    )
}

export default Pet;

