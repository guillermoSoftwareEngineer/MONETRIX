# MONEDIX - DOCUMENTACIÓN OFICIAL Y MANUAL TÉCNICO

Bienvenido a la documentación maestra de Monedix. Este archivo es la única fuente de verdad para el desarrollo, despliegue y gestión de la plataforma.

---

## 1. DESCRIPCIÓN DEL PROYECTO
Monedix es una herramienta de gestión financiera personal diseñada para el contexto colombiano, integrando inteligencia artificial, análisis de datos y un sistema de gamificación dinámico que fomenta la disciplina económica.

---

## 2. STACK TECNOLÓGICO

### Frontend
- **Framework:** Next.js (React)
- **Lenguaje:** TypeScript
- **Estilos:** Vanilla CSS
- **Animaciones:** Framer Motion
- **Visualización:** Recharts / Lucide Icons

### Backend
- **Framework:** NestJS
- **Lenguaje:** TypeScript
- **ORM:** TypeORM
- **Base de Datos:** PostgreSQL

### Inteligencia Artificial
- **Infraestructura:** Hugging Face Inference API (@huggingface/inference)
- **Modelo:** Qwen-2.5-7B-Instruct (Optimizado para asesoría financiera)

### Notificaciones
- **Servicio:** Nodemailer
- **SMTP:** Configurado para Mailtrap (Desarrollo)

---

## 3. GUÍA DE EJECUCIÓN LOCAL

Siga estas instrucciones para levantar el ecosistema Monedix en su máquina local:

### Requisitos Previos
- Node.js v18 o superior.
- Docker instalado (opcional para PostgreSQL).

### Paso 1: Configuración de Base de Datos
Si utiliza Docker, ejecute en la raíz:
```bash
docker-compose up -d
```
Asegúrese de que el puerto 5432 esté disponible.

### Paso 2: Servidor Backend
1. Ingrese a la carpeta `/backend`.
2. Instale dependencias: `npm install`
3. Configure su archivo `.env` con las siguientes variables obligatorias:
   - `DATABASE_URL` o parámetros de conexión.
   - `HUGGINGFACE_API_KEY` (Necesaria para Gastón).
   - `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` (Para el motor de correos).
4. Inicie el servidor: `npm run start:dev`

### Paso 3: Interfaz Web
1. Ingrese a la carpeta `/web`.
2. Instale dependencias: `npm install`
3. Configure `.env.local` con `NEXT_PUBLIC_API_URL`.
4. Inicie la aplicación: `npm run dev`
5. Acceda a `http://localhost:3001`.

---

## 4. IDENTIDAD DE MARCA: GASTÓN

Gastón es el asesor financiero central de la plataforma. Su identidad visual se basa en un **Androide Carismático estilo Caricatura**, diseñado para ser amigable y cercano.

### Puntos Clave de Identidad
- **Imagen Oficial:** Localizada en `web/public/gaston.png`.
- **Paleta de Colores:** Oro (#d4af37) y Gris Pizarra Profundo.
- **Tono de Voz:** Analítico, motivador y profesional.
- **Prohibiciones:** No utilizar iconos genéricos (cohetes, chispas) ni emojis informales en comunicaciones oficiales.

---

## 5. SISTEMA DE GAMIFICACIÓN REALISTA (1-1000)

Monedix utiliza un sistema de niveles que refleja la estabilidad financiera real del usuario:
- **Nivel Máximo:** 1000 (Umbral dinámico de 1000 XP por nivel).
- **Dinámica Volátil:** El usuario sube de nivel al registrar movimientos y cumplir metas, pero **baja de nivel** si su salud financiera se deteriora (exceso de presupuesto, falta de fondo de emergencia o incumplimiento de ahorro).
- **Prioridad de Salud:** El sistema prioriza la construcción del Fondo de Emergencia antes que el gasto discrecional.

---

## 6. HISTORIAL DE SANEAMIENTO IA Y LIMPIEZA

- **Auditoría de Logs:** Se han eliminado todos los `console.log` de depuración para un entorno de producción limpio.
- **Rediseño de Comunicaciones:** Correos electrónicos inspirados en la estética minimalista.

---
© 2026 MONEDIX - Ingeniería de Software de Alta Fidelidad.
