package org.huellas.salud.rest;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.groups.ConvertGroup;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.huellas.salud.domain.pet.PetMsg;
import org.huellas.salud.domain.pet.MedicalHistory;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.validators.ValidationGroups;
import org.huellas.salud.services.PetService;
import org.jboss.logging.Logger;

import java.net.UnknownHostException;
import java.util.List;

@Path("/internal/pet")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PetApi {

    private static final Logger LOG = Logger.getLogger(PetApi.class);

    @Inject
    PetService petService;

    @POST
    @RolesAllowed({"ADMINISTRADOR", "CLIENTE", "VETERINARIO"})
    @Path("/create")
    @Tag(name = "Gestión de mascotas")
    @Operation(
            summary = "Creación de una mascota",
            description = "Permite crear el registro de una mascota en la base de datos"
    )
    public Response createPetData(
            @RequestBody(
                    name = "petMsg",
                    description = "Información de la mascota a registrar",
                    required = true,
                    content = @Content(example = """
                        {
                                "data": {
                                        "idOwner": "1020657890",
                                        "name": "Princesa",
                                        "species": "PERRO",
                                        "breed": "Husky Siberiano",
                                        "sex": "HEMBRA",
                                        "age": "10",
                                        "weight": "15",
                                        "sterilized": false,
                                        "disability": "Ninguna",
                                        "description": "Perro de color gris con blanco",
                                        "isActive": true
                                }
                        }"""
                    )
            )
            @NotNull(message = "Debe ingresar los datos de la mascota")
            @ConvertGroup(to = ValidationGroups.Post.class) @Valid PetMsg petMsg
    ) throws HSException, UnknownHostException {

        LOG.debugf("@createPetData API > Inicia ejecucion del servicio para crear el registro de una mascota "
                + "en base de datos con la data: %s", petMsg.getData());

        PetMsg petCreated = petService.savePetDataMongo(petMsg);

        LOG.debugf("@createPetData API > Finaliza ejecucion del servicio para crear el registro de una mascota "
                + "en base de datos. Se registro la siguiente informacion: %s", petMsg);

        return Response.ok()
                .status(Response.Status.CREATED)
                .entity(petCreated)
                .build();
    }

    @GET
    @Path("/list-pets")
    @RolesAllowed({"ADMINISTRADOR", "VETERINARIO"})
    @Tag(name = "Gestión de mascotas")
    @Operation(
            summary = "Obtención de todas las mascotas registradas",
            description = "Permite obtener el listado de todas las mascotas registradas en la base de datos."
    )
    public Response getListPets() {

        LOG.debug("@getListPets API > Inicia servicio para obtener listado de registros de mascotas en base de datos");

        List<PetMsg> pets = petService.getListPetMsg();

        LOG.debugf("@getListPets API > Finaliza servicio para obtener listado de mascotas registradas. Se obtuvo: "
                + "%s resultados", pets.size());

        return Response.ok().entity(pets).build();
    }

    @GET
    @Path("/{idPet}")
    @RolesAllowed({"ADMINISTRADOR", "CLIENTE", "VETERINARIO"})
    @Tag(name = "Gestión de mascotas")
    @Operation(
            summary = "Obtención de una mascota",
            description = "Permite obtener la información de una mascota"
    )
    public Response getPet(
            @Parameter(
                    name = "idPet",
                    description = "Identificador de la mascota",
                    required = true,
                    example = "faf32d41-65b2-431b-a468-0dbc6650ae47"
            )
            @NotBlank(message = "Debe ingresar el identificador unico de la mascota")
            @PathParam("idPet") String idPet
    ) {
        LOG.debugf("@getPet API > Inicia ejecución del servicio para obtener la mascota con id: %s", idPet);

        PetMsg pet = petService.getPetById(idPet);

        LOG.debugf("@getPet API > Finaliza ejecución del servicio para obtener la mascota con id: %s. Se obtuvo: %s",
                idPet, pet != null ? "éxito" : "no encontrada");

        return Response.ok().entity(pet).build();
    }

    @GET
    @Path("/owners-pets/{idOwner}")
    @RolesAllowed({"ADMINISTRADOR", "CLIENTE", "VETERINARIO"})
    @Tag(name = "Gestión de mascotas")
    @Operation(
            summary = "Obtención de todas las mascotas registradas a un usuario",
            description = "Permite obtener el listado de todas las mascotas registradas a un usuario en la base de datos"
    )
    public Response getListPetsOfOwner(
            @Parameter(
                    name = "idOwner",
                    description = "Identificador del propietario",
                    required = true,
                    example = "123456789"
            )
            @NotBlank(message = "Debe ingresar el numero de documento del propietario")
            @PathParam("idOwner") String idOwner
    ) {

        LOG.debugf("@getListPetsOfOwner API > Inicia ejecucion del servicio que obtiene el listado de las "
                + "mascotas relacionadas al propietario con numero de identificacion: %s", idOwner);

        List<PetMsg> pets = petService.getListPetsByOwner(idOwner);

        LOG.debugf("@getListPetsOfOwner API > Finaliza ejecucion del servicio para obtener el listado de las "
                + "mascotas del propietario con numero documento: %s. Se obtuvo: %s resultados", idOwner, pets.size());

        return Response.ok().entity(pets).build();
    }

    @PUT
    @PermitAll
    @Path("/update")
    @Tag(name = "Gestión de mascotas")
    @Operation(
            summary = "Actualización de la información de una mascota",
            description = "Permite actuaizar la información de una mascota registrada en la base de datos"
    )
    public Response updatePetData(
            @RequestBody(
                    name = "petMsg",
                    description = "Información actualizada de la mascota",
                    required = true,
                    content = @Content(example = """
                        {
                                "data": {
                                        "idOwner": "1020657890",
                                        "idPet": "4c5dc938-7822-44b2-8e64-eff669fd8709",
                                        "name": "Princesa",
                                        "species": "PERRO",
                                        "breed": "Husky Siberiano",
                                        "sex": "HEMBRA",
                                        "age": "10",
                                        "weight": "15",
                                        "sterilized": false,
                                        "disability": "Ninguna",
                                        "description": "Perro de color gris con blanco",
                                        "isActive": true
                                }
                        }"""
                    )
            )
            @NotNull(message = "Debe ingresar los datos que se actualizarán de la mascota")
            @ConvertGroup(to = ValidationGroups.Put.class) @Valid PetMsg petMsg
    ) throws HSException {

        LOG.debugf("@updatePetData API > Inicia ejecucion del servicio para actualizar la informacion de una "
                + "mascota con la data: %s", petMsg.getData());

        petService.updatePetDataInMongo(petMsg);
        PetMsg petUpdated = petService.getPetById(petMsg.getData().getIdPet());

        LOG.debugf("@updatePetData API > Finaliza ejecucion del servicio de actualizacion de la informacion de "
                + "una mascota. Se actualizo con la siguiente informacion: %s", petMsg);

        return Response.ok(petUpdated)
                .build();
    }

    @DELETE
    @PermitAll
    @Path("/delete")
    @Tag(name = "Gestión de mascotas")
    @Operation(
            summary = "Eliminación de una mascota",
            description = "Permite la eliminación de una mascota"
    )
    public Response deletePetData(
            @Parameter(
                    name = "identifierPet",
                    description = "Identificador de la mascota",
                    required = true,
                    example = "26ec4a57-f43b-4230-a169-b0ef1fd6ade1"
            )
            @NotBlank(message = "Debe ingresar el identificador (identifierPet) de la mascota")
            @QueryParam("identifierPet") String identifierPet,
            @Parameter(
                    name = "idOwner",
                    description = "Identificador del propietario de la mascota",
                    required = true,
                    example = "1023456789"
            )
            @NotBlank(message = "Debe ingresar el identificador (idOwner) del propietario")
            @QueryParam("idOwner") String idOwner
    ) throws HSException {

        LOG.debugf("@deletePetData API > Inicia ejecucion del servicio para eliminar el registro de la mascota "
                + "con id: %s asociada al propietario con numero de documento: %s", identifierPet, idOwner);

        petService.deletePetDataInMongo(identifierPet, idOwner);

        LOG.debugf("@deletePetData API > Finaliza ejecucion del servicio para eliminar el registro de la mascota "
                + "con id: %s asociada al propietario con numero de documento: %s", identifierPet, idOwner);

        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @POST
    @PermitAll
    @Path("/{idPet}/medical-history")
    @Tag(name = "Gestión de mascotas")
    @Operation(
            summary = "Creación de un historial medico para una mascota",
            description = "Permite crear el historial medico para una mascota"
    )
    public Response addMedicalHistory(
            @Parameter(
                    name = "idPet",
                    description = "Identificador de la mascota",
                    required = true,
                    example = "26ec4a57-f43b-4230-a169-b0ef1fd6ade1"
            )
            @PathParam("idPet") String idPet,
            @RequestBody(
                    description = "Datos del historial médico a agregar",
                    required = true,
                    content = @Content(example = """
                        {
                                "diagnostic": "El perro presenta irritacion en la espalda",
                                "treatment": "Se le recomienda aplicar la crema cada 12 horas",
                                "veterinarian": "Santiago Muñoz Aponte",
                                "surgeries": [
                                        "Castracion"
                                ],
                                "vaccines": [
                                        {
                                                "name": "Rabia",
                                                "dateApplied": "2025-11-10",
                                                "validUntil": "2026-11-10",
                                                "singleDose": false
                                        }
                                ]
                        }"""
                    )
            ) MedicalHistory newHistory
    ) throws HSException {

        LOG.infof("@addMedicalHistory API > Inicia servicio de agregar historial medico a la mascota con id: %s", idPet);

        MedicalHistory medicalHistory = petService.addMedicalHistory(idPet, newHistory);

        LOG.infof("@addMedicalHistory API > Finaliza servicio de agregar historial medico a la mascota");

        return Response.status(Response.Status.CREATED)
                .entity(medicalHistory)
                .build();
    }
}
