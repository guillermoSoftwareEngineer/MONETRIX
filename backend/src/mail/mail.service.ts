import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST') || 'smtp.mailtrap.io',
            port: this.configService.get<number>('MAIL_PORT') || 2525,
            auth: {
                user: this.configService.get<string>('MAIL_USER') || 'placeholder',
                pass: this.configService.get<string>('MAIL_PASS') || 'placeholder',
            },
        });
    }

    private wrapInPremiumTemplate(content: string, title: string) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0c0cc00; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #18181b; border-radius: 20px; border: 1px solid #27272a; overflow: hidden; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; }
          .content { padding: 40px; line-height: 1.6; color: #d4d4d8; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; }
          h1 { color: #ffffff; margin-top: 0; }
          strong { color: #3b82f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0; font-size: 24px;">🚀 MONEDIX</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            &copy; 2025 Monedix - Tu Asesor Financiero Inteligente 👾<br>
            Este mensaje es automático. No respondas a este correo.
          </div>
        </div>
      </body>
      </html>
    `;
    }

    async sendReminderEmail(to: string, name: string, type: 'monthly' | 'quincenal') {
        const subject = `🚀 ¡Es momento de Monedix! Recordatorio ${type === 'monthly' ? 'Mensual' : 'Quincenal'}`;
        const content = `
      <h1>¡Hola, ${name}! 👋</h1>
      <p>Hoy es el gran día. Es momento de entrar a <strong>Monedix</strong> y poner tus finanzas al día.</p>
      <p>Recuerda que cada registro te otorga <strong>10 XP</strong> para subir de nivel y desbloquear nuevas medallas. ¡No dejes que Gastón se aburra!</p>
      <div style="text-align: center;">
        <a href="http://localhost:3001" class="button">Ir a mi Dashboard</a>
      </div>
      <p style="margin-top: 30px;"><strong>Beneficios de registrar hoy:</strong></p>
      <ul>
        <li>Control total de tu presupuesto mensual.</li>
        <li>Consejos personalizados del Científico de Datos.</li>
        <li>Evolución de tu rango y nivel.</li>
      </ul>
    `;

        await this.transporter.sendMail({
            from: '"Monedix Advisor" <no-reply@monedix.com>',
            to,
            subject,
            html: this.wrapInPremiumTemplate(content, subject),
        });
    }

    async sendInvestmentAlert(to: string, name: string, description: string, date: string) {
        const subject = `⚠️ ¡Alerta de Vencimiento: ${description}!`;
        const content = `
      <h1>¡Atención, ${name}! ⚠️</h1>
      <p>Tu inversión <strong>${description}</strong> está a punto de vencer mañana, día ${date}.</p>
      <p>Es el momento ideal para decidir si reinvertirás en los CDTs digitales con mejores tasas o si necesitas liquidez.</p>
      <div style="text-align: center;">
        <a href="http://localhost:3001" class="button">Ver Opciones de Inversión</a>
      </div>
      <p style="margin-top: 30px;"><em>"Una buena salud financiera depende de no dejar el dinero ocioso por mucho tiempo."</em> - Gastón 👾</p>
    `;

        await this.transporter.sendMail({
            from: '"Monedix Advisor" <no-reply@monedix.com>',
            to,
            subject,
            html: this.wrapInPremiumTemplate(content, subject),
        });
    }
}
