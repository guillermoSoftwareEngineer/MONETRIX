import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Finance } from '../finances/entities/finance.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReportsService {
    generateMonthlyReport(user: User, finances: Finance[]): Promise<Buffer> {
        return new Promise((resolve) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks: any[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Header
            doc.fillColor('#3b82f6').fontSize(24).text('MONEDIX - Reporte Financiero', { align: 'center' });
            doc.moveDown();
            doc.fillColor('#444444').fontSize(12).text(`Usuario: ${user.fullName || user.email}`);
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
            doc.text(`Nivel Actual: ${user.level}`);
            doc.moveDown();

            // Stats
            const totalIncome = finances.filter(f => f.type === 'INCOME').reduce((a, b) => a + Number(b.amount), 0);
            const totalExpense = finances.filter(f => f.type === 'EXPENSE').reduce((a, b) => a + Number(b.amount), 0);
            const balance = totalIncome - totalExpense;

            doc.fontSize(16).text('Resumen del Mes', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#10b981').text(`Ingresos: $${totalIncome.toLocaleString()}`);
            doc.fillColor('#ef4444').text(`Egresos: $${totalExpense.toLocaleString()}`);
            doc.fillColor(balance >= 0 ? '#10b981' : '#ef4444').text(`Balance Neto: $${balance.toLocaleString()}`);
            doc.moveDown();

            // Table Header
            doc.fillColor('#000000').fontSize(14).text('Detalle de Movimientos', { underline: true });
            doc.moveDown(0.5);

            const startX = 50;
            let currentY = doc.y;

            doc.fontSize(10).fillColor('#71717a');
            doc.text('Fecha', startX, currentY);
            doc.text('Descripción', startX + 80, currentY);
            doc.text('Categoría', startX + 250, currentY);
            doc.text('Monto', startX + 350, currentY, { align: 'right' });
            doc.moveDown(0.5);
            doc.path('M 50 ' + doc.y + ' L 550 ' + doc.y).stroke();
            doc.moveDown(0.5);

            // Table Rows
            doc.fillColor('#333333');
            finances.slice(0, 30).forEach((f) => {
                currentY = doc.y;
                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }
                doc.text(new Date(f.date).toLocaleDateString(), startX, currentY);
                doc.text(f.description, startX + 80, currentY, { width: 160 });
                doc.text(f.category || 'N/A', startX + 250, currentY);
                doc.text(`$${Number(f.amount).toLocaleString()}`, startX + 350, currentY, { align: 'right' });
                doc.moveDown(0.5);
            });

            // Footer
            doc.fontSize(8).fillColor('#a1a1aa').text(
                'Este es un reporte generado automáticamente por Monedix. Verifica tus datos periódicamente.',
                50, 750, { align: 'center' }
            );

            doc.end();
        });
    }
}
