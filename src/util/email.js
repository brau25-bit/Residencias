import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function emailService(email, token){
    try{
        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Verificación de Cuenta - Sistema de Reportes',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                        .button { display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
                        .footer { font-size: 12px; color: #6b7280; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Sistema de Reportes Ciudadanos</h2>
                        </div>
                        <div class="content">
                            <p>Estimado usuario,</p>
                            
                            <p>Ha recibido este correo electrónico porque se ha registrado una nueva cuenta en el Sistema de Reportes Ciudadanos.</p>
                            
                            <p>Para activar su cuenta y poder acceder a los servicios del sistema, es necesario que verifique su dirección de correo electrónico mediante el siguiente enlace:</p>
                            
                            <center>
                                <a href="${process.env.BACKEND_URL}/api/v1/auth/verify-account?token=${token}" class="button">
                                    Verificar Cuenta
                                </a>
                            </center>
                            
                            <p><strong>Importante:</strong></p>
                            <ul>
                                <li>Este enlace es válido únicamente para esta cuenta</li>
                                <li>Si usted no solicitó este registro, puede ignorar este mensaje</li>
                                <li>No comparta este enlace con terceros</li>
                            </ul>
                            
                            <div class="footer">
                                <p>Este es un correo automático, por favor no responda a este mensaje.</p>
                                <p>Sistema de Reportes Ciudadanos | Gobierno</p>
                                <p>© ${new Date().getFullYear()} Todos los derechos reservados</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        return result
    } catch (error) {
        console.error("Error in email service:", error);
        throw error; 
    }
}

export async function passwordService(email, token){
    try{
        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Recuperación de Contraseña - Sistema de Reportes',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                        .alert { background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 20px 0; }
                        .button { display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
                        .footer { font-size: 12px; color: #6b7280; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Sistema de Reportes Ciudadanos</h2>
                        </div>
                        <div class="content">
                            <p>Estimado usuario,</p>
                            
                            <p>Hemos recibido una solicitud de recuperación de contraseña para su cuenta en el Sistema de Reportes Ciudadanos.</p>
                            
                            <div class="alert">
                                <strong>Aviso de Seguridad:</strong> Si usted no solicitó este cambio, ignore este mensaje y su contraseña permanecerá sin cambios.
                            </div>
                            
                            <p>Para restablecer su contraseña, haga clic en el siguiente enlace:</p>
                            
                            <center>
                                <a href="${process.env.BACKEND_URL}/api/v1/auth/reset-password?token=${token}" class="button">
                                    Restablecer Contraseña
                                </a>
                            </center>
                            
                            <p><strong>Información importante:</strong></p>
                            <ul>
                                <li>Este enlace es válido por 1 hora</li>
                                <li>Solo puede utilizarse una vez</li>
                                <li>Después de restablecer su contraseña, deberá iniciar sesión nuevamente</li>
                                <li>No comparta este enlace con nadie</li>
                            </ul>
                            
                            <p>Si tiene problemas para acceder, por favor contacte al área de soporte técnico.</p>
                            
                            <div class="footer">
                                <p>Este es un correo automático, por favor no responda a este mensaje.</p>
                                <p>Sistema de Reportes Ciudadanos | Gobierno</p>
                                <p>© ${new Date().getFullYear()} Todos los derechos reservados</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        return result
    } catch (error) {
        console.error("Error in email service:", error);
        throw error; 
    }
}