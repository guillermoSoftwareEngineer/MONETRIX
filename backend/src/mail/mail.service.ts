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
          body { font-family: 'Outfit', sans-serif; background-color: #0a0a0c; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #1a1d26; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { padding: 40px 30px 20px; text-align: center; }
          .content { padding: 0 40px 40px; text-align: center; line-height: 1.6; color: #ededed; }
          .button { display: inline-block; padding: 14px 32px; background: #d4af37; color: #000000; text-decoration: none; border-radius: 12px; font-weight: 700; margin-top: 30px; transition: all 0.2s; }
          .footer { padding: 30px; text-align: center; font-size: 12px; color: #a1a1aa; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.2); }
          h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin-bottom: 10px; }
          strong { color: #d4af37; }
          .avatar { width: 120px; height: 120px; border-radius: 50%; border: 4px solid #d4af37; margin: 0 auto 20px; display: block; }
          .brand-logo { color: #d4af37; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
          ul { list-style: none; padding: 0; margin: 20px 0; }
          li { margin-bottom: 10px; position: relative; padding-left: 20px; text-align: left; display: inline-block; }
          li::before { content: "✓"; color: #d4af37; position: absolute; left: 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand-logo">MONEDIX</div>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            &copy; 2026 Monedix — Gestión Financiera de Alto Nivel<br>
            Este es un mensaje institucional.
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendReminderEmail(to: string, name: string, type: 'monthly' | 'quincenal') {
    const subject = `Es momento de tu Revisión Financiera - Monedix`;
    const content = `
      <img src="https://monedix.com/gaston.png" alt="Gastón" class="avatar">
      <h1>¡Hola, ${name}!</h1>
      <p>Es el momento ideal para entrar a <strong>Monedix</strong> y realizar tu revisión ${type === 'monthly' ? 'mensual' : 'quincenal'}.</p>
      <p>Recuerda que tu nivel de estabilidad financiera depende de tu disciplina en el registro de presupuestos.</p>
      <a href="http://localhost:3001" class="button">REALIZAR REVISIÓN AHORA</a>
      <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
        <ul>
          <li>Organiza tu presupuesto mensual</li>
          <li>Ajusta tus metas de ahorro</li>
          <li>Analiza tus gastos con Gastón</li>
        </ul>
      </div>
    `;

    await this.transporter.sendMail({
      from: '"Monedix Advisor" <no-reply@monedix.com>',
      to,
      subject,
      html: this.wrapInPremiumTemplate(content, subject),
    });
  }

  async sendInvestmentAlert(to: string, name: string, description: string, date: string) {
    const subject = `Alerta de Vencimiento: ${description} - Monedix`;
    const content = `
      <img src="https://monedix.com/gaston.png" alt="Gastón" class="avatar">
      <h1>¡Atención, ${name}!</h1>
      <p>Tu inversión <strong>${description}</strong> está a punto de vencer el día ${date}.</p>
      <p>Es el momento ideal para decidir si reinvertirás en opciones de alto rendimiento o si prefieres disponer de la liquidez.</p>
      <a href="http://localhost:3001" class="button">GESTIONAR INVERSIÓN</a>
      <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
        <p style="font-style: italic; color: #a1a1aa;">"La disciplina financiera consiste en no dejar el dinero ocioso." — Gastón</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: '"Monedix Advisor" <no-reply@monedix.com>',
      to,
      subject,
      html: this.wrapInPremiumTemplate(content, subject),
    });
  }
}
