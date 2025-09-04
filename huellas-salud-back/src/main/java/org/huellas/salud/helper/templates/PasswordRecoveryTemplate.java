package org.huellas.salud.helper.templates;

import java.time.Year;

public final class PasswordRecoveryTemplate {

    public static final String PASS_RECOVERY_TEMPLATE = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #38b2ac 0%, #3686ef 100%); padding: 20px; text-align: center; color: white;">
                        <div>
                            <span style="font-size: 24px; margin-right: 10px; vertical-align: middle;">\uD83D\uDC3E</span>
                            <h1 style="display: inline-block; margin: 0; font-size: 28px; vertical-align: middle;">Huellas & Salud</h1>
                            <span style="font-size: 24px; margin-left: 10px; vertical-align: middle;">\uD83D\uDC3E</span>
                        </div>
                        <h2 style="margin: 0; font-size: 18px;">Recuperación de contraseña</h2>
                    </div>
                    <!-- Content -->
                    <div style="padding: 20px;">
                        <p style="color: #4a5568; margin-bottom: 15px;">Hola <strong style="font-size: 14px;">{nombre}</strong>,</p>
                        <p style="color: #4a5568; margin-bottom: 15px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el sistema de Huellas & Salud.</p>
                        <p style="color: #4a5568; margin-bottom: 20px;">Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <a href="{link}" style="display: inline-block; background: #38b2ac; color: white; font-weight: bold; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 16px;">
                                Restablecer contraseña
                            </a>
                        </div>
                        <p style="color: #718096; font-size: 13px; margin-bottom: 5px;">Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña permanecerá igual.</p>
                        <p style="color: #718096; font-size: 13px; margin: 0 0 20px;">De lo contrario, este enlace solo se podrá utilizar una sola vez.</p>
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
                            <p style="color: #718096; margin-bottom: 8px;">⏰ Este enlace expirará en 24 horas.</p>
                            <p style="color: #718096;">\uD83D\uDD12 Por seguridad, no compartas este correo.</p>
                        </div>
                    </div>
                    <!-- Sección de Contacto -->
                    <div style="background: #f8fafc; padding: 5px 20px;">
                        <h3 style="font-size: 18px; font-weight: 600; color: #2d3748; margin-bottom: 16px;">Contacto</h3>
                        <div style="margin-bottom: 24px;">
                            <div>
                                <span style="color: #38b2ac; margin-right: 12px;">📍</span>
                                <span style="color: #718096;">Calle 116 # 18B-43, Bogotá D.C.</span>
                            </div>
                            <div>
                                <span style="color: #38b2ac; margin-right: 12px;">📞</span>
                                <span style="color: #718096;">304 567 8900</span>
                            </div>
                            <div>
                                <span style="color: #38b2ac; margin-right: 12px;">✉️</span>
                                <span style="color: #718096;">contacto@huellasysalud.com</span>
                            </div>
                            <div>
                                <span style="color: #38b2ac; margin-right: 12px;">🌐</span>
                                <span style="color: #718096;">www.huellasysalud.com</span>
                            </div>
                        </div>
                        <div style="background: #f8fafc; text-align: center;">
                            <p style="color: #718096; font-size: 12px; margin: 0;">
                                © {date} Huellas & Salud. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>""";

    public static final String EMAIL_CONFIRM_TEMPLATE = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirma tu correo - Huellas & Salud</title>
            </head>
            <body style="font-family: 'Arial', sans-serif; background-color: #f7fafc; margin: 0; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    <!-- Header con logo y nombre -->
                    <div style="background: linear-gradient(135deg, #38b2ac 0%, #3686ef 100%); padding: 25px; text-align: center; color: white;">
                        <div style="display: inline-block;">
                            <span style="font-size: 28px; margin-right: 8px; vertical-align: middle;">\uD83D\uDC3E</span>
                            <h1 style="display: inline-block; margin: 0; font-size: 28px; font-weight: 600; vertical-align: middle;">Huellas & Salud</h1>
                            <span style="font-size: 28px; margin-left: 8px; vertical-align: middle;">\uD83D\uDC3E</span>
                        </div>
                        <h2 style="margin: 10px 0 0; font-size: 18px; font-weight: 400;">Cuidando a tus compañeros de vida</h2>
                    </div>
                    <!-- Contenido principal -->
                    <div style="padding: 25px;">
                        <p style="color: #4a5568; margin-bottom: 16px; line-height: 1.5;">Hola <strong style="color: #2d3748;">{nombre}</strong>,</p>
                        <p style="color: #4a5568; margin-bottom: 16px; line-height: 1.5;">¡Bienvenido/a a la familia de Huellas & Salud! Estamos muy contentos de que confíes en nosotros para el cuidado de tu mascota.</p>
                        <p style="color: #4a5568; margin-bottom: 20px; line-height: 1.5;">Para completar tu registro, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="{link}" style="display: inline-block; background: #38b2ac; color: white; font-weight: bold; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-size: 16px; box-shadow: 0 2px 8px rgba(56, 178, 172, 0.3); transition: all 0.3s ease;">
                                Confirmar mi correo
                            </a>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                            <p style="color: #718096; font-size: 13px; margin-bottom: 8px;">⏰ Este enlace expirará en 72 horas por seguridad.</p>
                            <p style="color: #718096; font-size: 13px; margin-bottom: 0;">\uD83D\uDD12 Por favor, no compartas este correo con nadie.</p>
                        </div>
                        <p style="color: #4a5568; margin-bottom: 5px; line-height: 1.5;">Si no creaste una cuenta con nosotros, puedes ignorar este mensaje.</p>
                        <p style="color: #4a5568; margin-top: 25px; line-height: 1.5;">Cordialmente,<br><strong>El equipo de Huellas & Salud</strong></p>
                    </div>
                    <!-- Sección de Contacto -->
                    <div style="background: #f8fafc; padding: 20px; border-top: 1px solid #e2e8f0;">
                        <h3 style="font-size: 16px; font-weight: 600; color: #2d3748; margin-bottom: 15px; text-align: center;">¿Necesitas ayuda?</h3>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <a href="mailto:contacto@huellasysalud.com" style="display: inline-block; color: #38b2ac; text-decoration: none; margin: 0 10px;">
                                <span style="color: #38b2ac;">✉️</span> contacto@huellasysalud.com
                            </a>
                            <a href="tel:3045678900" style="display: inline-block; color: #38b2ac; text-decoration: none; margin: 0 10px;">
                                <span style="color: #38b2ac;">\uD83D\uDCDE</span> 304 567 8900
                            </a>
                        </div>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <a href="http://localhost:5173" style="display: inline-block; color: #38b2ac; text-decoration: none; margin: 0 10px;">
                                <span style="color: #38b2ac;">\uD83C\uDF10</span> www.huellasysalud.com
                            </a>
                            <span style="display: inline-block; color: #718096; margin: 0 10px;">
                                <span style="color: #38b2ac;">\uD83D\uDCCD</span> Calle 116 # 18B-43, Bogotá D.C.
                            </span>
                        </div>
                        <!-- Redes Sociales -->
                        <div style="text-align: center; margin-bottom: 20px;">
                            <p style="color: #718096; font-size: 14px; margin-bottom: 10px;">Síguenos en redes sociales:</p>
                            <div>
                                <a href="#" style="display: inline-block; margin: 0 5px; text-decoration: none;">\uD83D\uDCF1</a>
                                <a href="#" style="display: inline-block; margin: 0 5px; text-decoration: none;">\uD83D\uDCF7</a>
                                <a href="#" style="display: inline-block; margin: 0 5px; text-decoration: none;">\uD83D\uDD35</a>
                            </div>
                        </div>
                        <!-- Footer -->
                        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                            <p style="color: #718096; font-size: 12px; margin: 0;">
                                © {date} Huellas & Salud Veterinaria. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>""";

    private static final String TEXT_CONTENT_PASS_RECOVERY = """
            "Hola %s," +
            "Para restablecer tu contraseña en Huellas & Salud, visita el siguiente enlace: %s" +
            "Este enlace expirará en 24 horas." +
            "© %d Huellas & Salud""";

    private static final String TEXT_CONTENT_CONFIRM_EMAIL = """
            "Hola %s," +
            "Para confirmar tu correo en Huellas & Salud, dirígete al siguiente enlace: %s" +
            "Este enlace expirará en 72 horas." +
            "© %d Huellas & Salud""";

    public static String getTextContentPassRecovery(String userName, String recoveryLink) {
        return String.format(
                TEXT_CONTENT_PASS_RECOVERY,
                userName,
                recoveryLink,
                Year.now().getValue()
        );
    }

    public static String getTextContentConfirmEmail(String userName, String recoveryLink) {
        return String.format(
                TEXT_CONTENT_CONFIRM_EMAIL,
                userName,
                recoveryLink,
                Year.now().getValue()
        );
    }

    public static String formatPasswordRecovery(String userName, String recoveryLink) {

        String template = PASS_RECOVERY_TEMPLATE;

        template = template.replace("{nombre}", userName);
        template = template.replace("{link}", recoveryLink);
        template = template.replace("{date}", String.valueOf(Year.now().getValue()));

        return template;
    }

    public static String formatConfirmEmail(String userName, String recoveryLink) {

        String template = EMAIL_CONFIRM_TEMPLATE;

        template = template.replace("{nombre}", userName);
        template = template.replace("{link}", recoveryLink);
        template = template.replace("{date}", String.valueOf(Year.now().getValue()));

        return template;
    }
}
