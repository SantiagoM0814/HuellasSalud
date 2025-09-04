package org.huellas.salud.helper.templates;

import java.time.Year;

public class ConfirmEmailTemplate {

    public static final String SUCCESS_CONFIRM_EMAIL_TEMPLATE = """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Correo Confirmado</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        padding: 30px;
                        text-align: center;
                        max-width: 500px;
                        width: 90%;
                    }
                    .button {
                        background-color: #4CAF50;
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        display: inline-block;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div style="color: #4CAF50; font-size: 50px; margin-bottom: 20px;">✓</div>
                    <h1 style="color: #333; margin-bottom: 20px;">¡Correo confirmado con éxito!</h1>
                    <h3>Bienvenid@ {name} a la familia de Huellas y Salud</h3>
                    <p style="color: #666; margin-bottom: 20px; line-height: 1.4;">
                        Tu dirección de correo electrónico ha sido verificada correctamente. Ahora puedes disfrutar de todos los beneficios de nuestra plataforma.
                    </p>
                    <a href="http://localhost:5173" class="button">Ir a la página principal</a>
                    <!-- Footer -->
                    <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                        <p style="color: #718096; font-size: 12px; margin: 0;">
                            © {year} Huellas & Salud Veterinaria. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """;

    public static final String ERROR_CONFIRM_EMAIL_TEMPLATE = """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Error en confirmación</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        padding: 30px;
                        text-align: center;
                        max-width: 510px;
                        width: 90%;
                    }
                    .paragraph {
                        color: #666;
                        margin-bottom: 10px;
                        line-height: 1.6;
                    }
                    .error-detail {
                        background-color: #ffeeee;
                        border-left: 4px solid #f44336;
                        padding: 10px;
                        margin: 20px 0;
                        text-align: justify;
                        color: #d32f2f;
                    }
                    .button {
                        background-color: #f44336;
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                        display: inline-block;
                        margin: 5px 0 15px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div style="color: #f44336; font-size: 50px; margin-bottom: 20px;">✗</div>
                    <h1 style="color: #333; margin-bottom: 20px;">Error en la confirmación</h1>
                    <p class="paragraph">Ocurrió un problema al intentar confirmar tu dirección de correo electrónico.</p>
                    <div class="error-detail">{message}</div>
                    <p class="paragraph">Por favor, intenta nuevamente o contacta con soporte técnico.</p>
                    <a href="http://localhost:5173/contacto" class="button">Contactar soporte</a>
                    <!-- Footer -->
                    <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                        <p style="color: #718096; font-size: 12px; margin: 0;">
                            © {year} Huellas & Salud Veterinaria. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """;

    public static String formatSuccessTemplate(String userName) {

        String template = SUCCESS_CONFIRM_EMAIL_TEMPLATE;

        template = template.replace("{name}", userName);
        template = template.replace("{year}", String.valueOf(Year.now().getValue()));

        return template;
    }

    public static String formatErrorTemplate(String message) {

        String template = ERROR_CONFIRM_EMAIL_TEMPLATE;

        template = template.replace("{message}", message);
        template = template.replace("{year}", String.valueOf(Year.now().getValue()));

        return template;
    }
}
