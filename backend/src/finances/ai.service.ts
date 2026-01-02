import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class AIService {
    private readonly logger = new Logger(AIService.name);
    private hf: HfInference;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY');
        if (apiKey) {
            this.hf = new HfInference(apiKey);
        } else {
            this.logger.warn('Token de Hugging Face no encontrado. El servicio de IA no funcionará correctamente.');
        }
    }

    async askAdvisor(question: string, context?: any, userApiKey?: string): Promise<string> {
        // 1. Determinar la API Key a usar (Hugging Face)
        const apiKey = userApiKey || this.configService.get<string>('HUGGINGFACE_API_KEY');

        if (!apiKey || apiKey === '********' || apiKey.trim() === '') {
            this.logger.warn('Intento de chat sin Token de IA válido');
            return "No tienes un Token de Hugging Face configurado. Por favor, ve a Configuración y genera uno gratuito de Hugging Face.";
        }

        const pureApiKey = apiKey.trim();
        const hf = new HfInference(pureApiKey);

        // 2. Configuración del Asesor (System Message)
        const systemInstruction = `
            Eres Gastón, un asesor financiero senior y experto de la plataforma MONEDIX.
            Tu misión es analizar la salud financiera de los usuarios basándote en sus datos reales y dar consejos accionables.
            
            DEFINICIONES DE DATOS (MÚY IMPORTANTE):
            - "balance": Es el dinero LÍQUIDO disponible ahora (Ingresos - Gastos - Inversiones). Es la cifra principal que ve el usuario.
            - "totalInvestments": Dinero en CDTs u otros activos no líquidos.
            - "netWorth": Tu patrimonio total (balance + inversiones). Si el usuario pregunta "cuanto tengo en total", usa esta cifra.
            - "savingsGoal": La META DE AHORRO que el usuario quiere alcanzar. Compárala con 'totalInvestments' o ahorros específicos.
            - "emergencyFundGoal": La META DE FONDO DE EMERGENCIA. Es CRÍTICO que el usuario la alcance para su estabilidad.
            
            REGLAS DE RESPUESTA:
            1. SIEMPRE inicia con: "⚠️ Aviso: Soy una IA y mis respuestas son informativas. La decisión final es tuya y Monedix no se hace responsable.\n\n"
            2. Reporta las cifras EXACTAS del contexto. No inventes números.
            3. Si existe "savingsGoal" > 0, menciona cuánto le falta en porcentaje o monto. ¡Anímalo!
            4. Si "emergencyFundGoal" no se ha cumplido, prioriza recomendar completarlo antes de inversiones riesgosas.
            5. Usa negritas para las cifras y puntos para estructurar.
            5. El nombre de la plataforma es MONEDIX.
        `;

        const modelName = 'Qwen/Qwen2.5-7B-Instruct';

        try {
            if (!hf) {
                throw new Error("Hugging Face client not initialized");
            }

            const response = await hf.chatCompletion({
                model: modelName,
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: `CONTEXTO FINANCIERO: ${JSON.stringify(context || 'No hay datos disponibles')}\n\nPREGUNTA: ${question}` }
                ],
                max_tokens: 800,
                temperature: 0.7
            });

            const result = response.choices[0]?.message?.content || '';

            if (!result) {
                throw new Error("No response from Hugging Face");
            }

            return result;
        } catch (error) {
            // Manejo de errores profesional
            if (error.message.includes('401')) {
                return "Tu Token de Hugging Face es inválido. Por favor, corrígelo en Configuración.";
            }

            if (error.message.includes('503') || error.message.includes('provider') || error.message.includes('Failed to perform inference')) {
                return "El servicio de asesoría está temporalmente saturado en sus servidores gratuitos. Por favor, reintenta tu pregunta en unos segundos.";
            }

            return "Lo siento, tuve un inconveniente técnico al contactar al asesor. Por favor, intenta de nuevo en un momento.";
        }
    }
}
