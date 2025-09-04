package org.huellas.salud.services;

import io.quarkus.cache.CacheInvalidateAll;
import io.quarkus.cache.CacheResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.huellas.salud.domain.Meta;
import org.huellas.salud.domain.mail.PasswordRecovery;
import org.huellas.salud.domain.mail.PasswordRecoveryEmail;
import org.huellas.salud.domain.user.User;
import org.huellas.salud.domain.user.UserDTO;
import org.huellas.salud.domain.user.UserMsg;
import org.huellas.salud.helper.exceptions.HSException;
import org.huellas.salud.helper.jwt.JwtService;
import org.huellas.salud.helper.utils.Utils;
import org.huellas.salud.repositories.MediaFileRepository;
import org.huellas.salud.repositories.PasswordRecoveryRepository;
import org.huellas.salud.repositories.UserRepository;
import org.jboss.logging.Logger;
import org.mindrot.jbcrypt.BCrypt;

import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

@ApplicationScoped
public class UserService {

    private static final Logger LOG = Logger.getLogger(UserService.class);

    @Inject
    Utils utils;

    @Inject
    JwtService jwtService;

    @Inject
    MailService mailService;

    @Inject
    UserRepository userRepository;

    @Inject
    MediaFileRepository mediaFileRepository;

    @Inject
    PasswordRecoveryRepository passwordRecoveryRepository;

    public UserMsg getRegisteredUserInMongo(UserMsg userMsg) throws HSException {

        final String userEmailOrDocument = userMsg.getData().getEmailOrDoc();

        LOG.infof("@getRegisteredUserInMongo SERV > Inicia ejecucion de servicio para obtener registro del " +
                "usuario con correo o numero de documento: %s en mongo", userEmailOrDocument);

        UserMsg userMongo = getUserRegister(userEmailOrDocument);

        LOG.infof("@getRegisteredUserInMongo SERV > Informacion de usuario obtenida: %s", userMongo);

        validateUserStatus(userEmailOrDocument, userMongo.getData());
        validatePassword(userMsg.getData().getPassword(), userMongo.getData().getPassword(), userEmailOrDocument);

        userMongo.setData(getUserDto(userMongo, true));

        LOG.infof("@getRegisteredUserInMongo SERV > Finaliza ejecucion de servicio. La informacion del " +
                "usuario que se obtuvo es: %s. Inicia generacion del token del usuario", userMongo);

        userMongo.setToken(jwtService.generateToken(userMongo.getData()));

        return userMongo;
    }

    private UserMsg getUserRegister(String userEmailOrDocument) throws HSException {

        LOG.infof("@getUserRegister SERV > Se consulta usuario con correo o numero documento: %s", userEmailOrDocument);

        Optional<UserMsg> userMsg = isEmail(userEmailOrDocument)
                ? userRepository.findUserDataByEmail(userEmailOrDocument)
                : userRepository.findUserByDocumentNumber(userEmailOrDocument);

        return userMsg.orElseThrow(() -> {

            LOG.errorf("@getRegisteredUserInMongo SERV > No se encontro informacion del registro del usuario " +
                    "con el correo o documento: %s en base de datos", userEmailOrDocument);

            return new HSException(Response.Status.NOT_FOUND, "El usuario con correo: " + userEmailOrDocument +
                    " No se encuentra registrado en la base de datos");
        });
    }

    @CacheResult(cacheName = "users-list-cache")
    public List<UserMsg> getListRegisteredUser() {

        LOG.info("@getListRegisteredUser SERV > Inicia servicio para obtener listado de usuarios registrados en mongo");

        List<UserMsg> users = getUserData();

        LOG.infof("@getListRegisteredUser SERV > Finaliza consulta, se retorna un total de %s registros de mongo. " +
                "Finaliza ejecucion del servicio para obtener listado de usuarios registrados", users.size());

        return users;
    }

    @CacheInvalidateAll(cacheName = "users-list-cache")
    public UserMsg saveUserDataInMongo(UserMsg userMsg) throws UnknownHostException, HSException {

        LOG.info("@saveUserDataInMongo SERV > Inicia verificacion si el usuario ya esta registrado en la base de datos");

        validateIfUserIsRegistered(userMsg.getData().getDocumentNumber(), userMsg.getData().getEmail());

        LOG.info("@saveUserDataInMongo SERV > El usuario no existe. Inicia servicio de encriptacion de password");

        validatePasswordEncrypted(userMsg.getData());

        LOG.info("@saveUserDataInMongo SERV > Encriptación de contraseña validada. Inicia formato de datos de usuario");

        formatUserDataToCreateUser(userMsg);

        LOG.infof("@saveUserDataInMongo SERV > Datos de usuario formateados correctamente. Inicia almacenamiento " +
                "del registro en mongo con la data: %s", userMsg);

        userRepository.persist(userMsg);

        LOG.infof("@saveUserDataInMongo SERV > El usuario con documento: %s y correo: %s se creo correctamente " +
                "en la base de datos", userMsg.getData().getDocumentNumber(), userMsg.getData().getEmail());

        userMsg.setData(getUserDto(userMsg, false));

        LOG.info("@saveUserDataInMongo SERV > Inicia servicio de envio de correo de confirmacion de cuenta");

        mailService.sendConfirmationEmail(userMsg.getData());

        LOG.info("@saveUserDataInMongo SERV > Finaliza servicio de registro de usuario");

        return userMsg;
    }

    @CacheInvalidateAll(cacheName = "users-list-cache")
    public void updateUserDataInMongo(UserMsg userMsg) throws HSException {

        LOG.infof("@updateUserDataInMongo SERV > Inicia ejecucion de servicio de actualizacion de registro " +
                "de usuario con la data: %s. Inicia consulta de usuario", userMsg.getData());

        String email = userMsg.getData().getEmail();
        String documentNumber = userMsg.getData().getDocumentNumber();

        UserMsg userMsgMongo = getUserByDocumentNumber(documentNumber, email);

        LOG.infof("@updateUserDataInMongo SERV > El usuario con documento: %s y correo: %s si esta registrado. " +
                "Se procede a realizar validacion del correo si va a ser modificado", documentNumber, email);

        validateUserEmail(email, userMsgMongo.getData().getEmail());

        LOG.infof("@updateUserDataInMongo SERV > Finaliza validacion del correo a actualizar el correo: %s es " +
                "valido. Inicia verificacion de password del usuario con documento: %s", email, documentNumber);

        validatePasswordEncrypted(userMsg.getData());

        LOG.infof("@updateUserDataInMongo SERV > Finaliza verificacion de password del usuario con data: %s. " +
                "Inicia actualizacion de la informacion del usuario con id: %s", userMsg.getData(), documentNumber);

        updateUserInformation(userMsgMongo, userMsg.getData(), documentNumber);

        LOG.infof("@updateUserDataInMongo SERV > Finaliza edicion de usuario con id: %s. Inicia actualizacion " +
                "en mongo con la data: %s", documentNumber, userMsgMongo);

        userRepository.update(userMsgMongo);

        LOG.infof("@updateUserDataInMongo SERV > Finaliza actualizacion registro usuario de numero documento: %s " +
                "y correo: %s. Se actualizo el registro con la data: %s.", documentNumber, email, userMsgMongo);
    }

    @CacheInvalidateAll(cacheName = "users-list-cache")
    public void deleteUserDataInMongo(String documentNumber, String emailUser) throws HSException {

        LOG.infof("@deleteUserDataInMongo SERV > Inicia ejecucion del servicio para eliminar registro del " +
                "usuario con id: %s y correo: %s de mongo", documentNumber, emailUser);

        long deleted = userRepository.deleteUserDataMongo(documentNumber, emailUser);

        if (deleted == 0) {

            LOG.errorf("@deleteUserDataInMongo SERV > El registro de usuario con numero de documento: %s No " +
                    "existe en mongo. No se realiza eliminacion. Registros eliminados: %s", documentNumber, deleted);

            throw new HSException(Response.Status.NOT_FOUND, "El usuario con numero de documento: " + documentNumber +
                    " y correo: " + emailUser + " No esta registrado en la base de datos");
        }

        // TODO - Eliminar las mascotas asociadas al usuario eliminado

        LOG.infof("@deleteUserDataInMongo SERV > El registro del usuario con numero de documento: %s y correo: " +
                "%s se elimino correctamente de mongo. Finaliza ejecucion del servicio para eliminar usuario y se " +
                "elimino %s registro de la base de datos", documentNumber, emailUser, deleted);
    }

    public void updateUserPassword(PasswordRecovery passwordRecovery) throws HSException {

        LOG.info("@updateUserPassword SERV > Inicia servicio de actualizacion de contrasena de usuario");

        PasswordRecoveryEmail recovery = mailService.getPasswordRecovery(passwordRecovery.getData().approvalCode());

        LOG.infof("@updateUserPassword SERV > Se obtuvo el registro: %s", recovery);

        User user = recovery.getDataUser();
        UserMsg userMsg = getUserByDocumentNumber(user.getDocumentNumber(), user.getEmail());

        LOG.infof("@updateUserPassword SERV > Usuario obtenido: %s", user);

        user.setPassword(passwordRecovery.getData().newPassword());
        validatePasswordEncrypted(user);

        userMsg.getData().setPassword(user.getPassword());

        LOG.infof("@updateUserPassword SERV > Inicia actualizacion del usuario: %s en mongo", user.getDocumentNumber());

        userRepository.update(userMsg);

        LOG.info("@updateUserPassword SERV > Inicia actualizacion de registro de recuperacion de contrasena");

        recovery.setRecovered(true);
        passwordRecoveryRepository.update(recovery);

        LOG.infof("@updateUserPassword SERV > Contrasena actualizada. ID usuario: %s", user.getDocumentNumber());
    }

    public UserMsg getUserByDocumentNumber(String documentNumber, String email) throws HSException {

        return userRepository.findUserByDocumentNumber(documentNumber).orElseThrow(() -> {

            LOG.errorf("@getUserByDocumentNumber SERV > El usuario con documento: %s y correo: %s NO esta " +
                    "registrado. Solicitud invalida no se puede editar registro", documentNumber, email);

            return new HSException(Response.Status.NOT_FOUND, "No se encontró el registro del usuario con numero de " +
                    "documento: " + documentNumber + " y correo: " + email + " en base de datos");
        });
    }

    private void validateUserEmail(String emailUpdate, String emailMongo) throws HSException {

        LOG.infof("@validateUserEmail SERV > Inicia validacion del email de usuario si se modifico. Correo " +
                "actual: %s. Correo en solicitud de actualizacion: %s", emailMongo, emailUpdate);

        if (emailUpdate != null && !emailUpdate.equals(emailMongo)) {

            LOG.infof("@validateUserEmail SERV > El correo tambien se actualizara. Inicia validacion de que " +
                    "no exista un registro con el correo a modificar: %s", emailUpdate);

            if (userRepository.findUserDataByEmail(emailUpdate).isPresent()) {

                LOG.errorf("@validateUserEmail SERV > Ya existe un usuario con el correo: %s. No se puede " +
                        "actualizar el registro, se debe cambiar por otro correo que no exista en mongo", emailUpdate);

                throw new HSException(Response.Status.BAD_REQUEST, "Ya existe un usuario con el correo: " + emailUpdate +
                        ", por favor ingrese otro para poder actualizar los datos");
            }

            LOG.infof("@validateUserEmail SERV > No se encontro registro de usuario con ese correo. Se continua " +
                    "con la actualizacion de usuario. Correo antiguo: %s. Correo nuevo: %s", emailMongo, emailUpdate);
        }
    }

    private void validateUserStatus(String emailOrDocument, User user) throws HSException {

        LOG.infof("@validateUserStatus SERV > Inicia validacion del estado del usuario con ID: %s", emailOrDocument);

        if (!user.getActive()) {

            LOG.errorf("@validateUserStatus SERV > El usuario con ID: %s esta en estado INACTIVO", emailOrDocument);

            throw new HSException(Response.Status.CONFLICT, "EL usuario no se encuentra activo");
        }
        LOG.infof("@validateUserStatus SERV > El usuario con ID: %s se encuentra activo", emailOrDocument);
    }

    public UserDTO getUserDto(UserMsg userMsg, boolean searchImg) {

        UserDTO userDTO = new UserDTO();

        userDTO.setName(userMsg.getData().getName());
        userDTO.setLastName(userMsg.getData().getLastName());
        userDTO.setRole(userMsg.getData().getRole());
        userDTO.setEmail(userMsg.getData().getEmail());
        userDTO.setActive(userMsg.getData().getActive());
        userDTO.setDocumentType(userMsg.getData().getDocumentType());
        userDTO.setDocumentNumber(userMsg.getData().getDocumentNumber());
        userDTO.setAddress(userMsg.getData().getAddress());
        userDTO.setCellPhone(userMsg.getData().getCellPhone());

        if (searchImg) {
            mediaFileRepository.getMediaByEntityTypeAndId("USER", userMsg.getData().getDocumentNumber())
                    .ifPresent(media -> userDTO.setMediaFile(media.getData()));
        }

        return userDTO;
    }

    private List<UserMsg> getUserData() {

        LOG.info("@getUserData SERV > Inicia servicio que consulta y transforma la informacion de cada usuario en " +
                "un DTO para asi retornar solo los datos necesarios");

        return userRepository.getRegisteredUsersMongo().stream()
                .peek(userMsg -> userMsg.setData(getUserDto(userMsg, true)))
                .toList();
    }

    private void validateIfUserIsRegistered(String documentNumber, String email) throws HSException {

        LOG.info("@validateIfUserIsRegistered SERV > Iniciando validacion de usuario no registrado");

        if (userRepository.findUserByEmailOrDocument(documentNumber, email).isPresent()) {

            LOG.errorf("@validateIfUserIsRegistered SERV > El usuario con numero de documento: %s o correo: %s " +
                    "ya se encuentra registrado. La solicitud es invalidada", documentNumber, email);

            throw new HSException(Response.Status.BAD_REQUEST, "El usuario con correo: " + email + " o número de " +
                    "documento: " + documentNumber + " ya se encuentra registrado en la base de datos");
        }
        LOG.infof("@validateIfUserIsRegistered SERV > Finaliza consulta de registro. Validacion exitosa, el " +
                "usuario con documento: %s y correo: %s No ha sido registrado previamente.", documentNumber, email);
    }

    private void validatePasswordEncrypted(User user) {

        LOG.info("@validatePasswordEncrypted SERV > Inicia verificacion del password si ya esta encriptado");

        if (user.getPassword() != null && user.getPassword().length() < 25) {

            LOG.infof("@validatePasswordEncrypted SERV > El password ingresado No esta encriptado. Inicia proceso " +
                    "de encriptar el password del cliente con numero de documento: %s", user.getDocumentNumber());

            user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));

            LOG.info("@validatePasswordEncrypted SERV > El password del usuario fue encriptado correctamente");
        }

        LOG.info("@validatePasswordEncrypted SERV > Finaliza verificacion del password si ya estaba encriptado");
    }

    private void formatUserDataToCreateUser(UserMsg userMsg) throws UnknownHostException {

        LOG.infof("@formatUserDataToCreateUser SERV > Inicia formato de datos del usuario con numero de " +
                "documento: %s para ser almacenados en mongo.", userMsg.getData().getDocumentNumber());

        User user = userMsg.getData();

        user.setActive(false);
        user.setName(utils.capitalizeWords(user.getName()));
        user.setLastName(utils.capitalizeWords(user.getLastName()));

        LOG.infof("@formatUserDataToCreateUser SERV > Finaliza formato al nombre del usuario con data: %s. " +
                "Inicia estructura del objeto meta con la informacion de auditoria", userMsg.getData());

        userMsg.setMeta(utils.getMetaToEntity());

        LOG.infof("@formatUserDataToCreateUser SERV > Finaliza estructura del objeto meta correctamente. " +
                "Finaliza formato de datos del usuario con correo: %s.", user.getEmail());
    }

    private void updateUserInformation(UserMsg userMsgMongo, User editedUser, String idUser) {

        LOG.infof("@updateUserInformation SERV > Inicia actualizacion de datos de usuario con id: %s", idUser);

        User userMongo = userMsgMongo.getData();
        Meta metaMongo = userMsgMongo.getMeta();

        userMongo.setActive(editedUser.getActive());
        userMongo.setEmail(editedUser.getEmail());
        userMongo.setCellPhone(editedUser.getCellPhone());
        userMongo.setAddress(Objects.requireNonNullElse(editedUser.getAddress(), userMongo.getAddress()));
        userMongo.setPassword(Objects.requireNonNullElse(editedUser.getPassword(), userMongo.getPassword()));
        userMongo.setRole(Objects.requireNonNullElse(editedUser.getRole(), userMongo.getRole()));
        userMongo.setDocumentType(editedUser.getDocumentType());
        userMongo.setName(utils.capitalizeWords(editedUser.getName()));
        userMongo.setLastName(utils.capitalizeWords(editedUser.getLastName()));

        metaMongo.setLastUpdate(LocalDateTime.now());
        metaMongo.setNameUserUpdated(jwtService.getCurrentUserName());
        metaMongo.setEmailUserUpdated(jwtService.getCurrentUserEmail());
        metaMongo.setRoleUserUpdated(jwtService.getCurrentUserRole());

        LOG.infof("@updateUserDataInformation SERV > Finaliza actualizacion de datos de usuario con id: %s", idUser);
    }

    private boolean isEmail(String value) {

        String regex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

        return Pattern.compile(regex).matcher(value).matches();
    }

    private void validatePassword(String inputPassword, String storedHash, String userEmailOrDocument) throws HSException {

        LOG.infof("@validatePassword SERV > Inicia servicio de validacion del password ingresado del usuario " +
                "con correo o numero documento: %s", userEmailOrDocument);

        if (!BCrypt.checkpw(inputPassword, storedHash)) {

            LOG.errorf("@getRegisteredUserInMongo SERV > El password ingresado no es valido para el usuario " +
                    "con correo: %s", userEmailOrDocument);

            throw new HSException(Response.Status.BAD_REQUEST, "Error en los recursos suministrados");
        }
    }
}
