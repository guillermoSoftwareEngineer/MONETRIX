# MONEDIX - Finanzas con Proposito

Monedix es la plataforma de gestion de finanzas personales diseñada especificamente para el contexto colombiano. Combina Psicologia Financiera, Gamificacion y Analitica Avanzada para ayudar a los usuarios a tomar el control total de su dinero.

---

## Caracteristicas Principales

- **Gestion Dinamica de Presupuestos**: Creacion de conceptos de gasto y establecimiento de limites personalizados.
- **Gamificacion (XP y Niveles)**: Sistema de experiencia por cada registro y progresion de nivel con el asesor financiero Gaston.
- **Analitica Visual**: Graficos interactivos de tendencias mensuales y comparativas de gasto.
- **Multidivisa Inteligente**: Soporte para COP, USD y EUR con conversion automatica.
- **Reportes Profesionales**: Generacion de resumenes mensuales en PDF.
- **Alertas y Recordatorios**: Notificaciones inteligentes para el seguimiento de inversiones y gastos.

---

## Stack Tecnologico

- **Frontend**: Next.js 15, React, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: NestJS, TypeORM, PostgreSQL.
- **Seguridad**: Autenticacion JWT, BCrypt, Cumplimiento OWASP MASVS.
- **Infraestructura**: Docker, Node.js.

---

## Estructura del Proyecto

```text
MONETRIX/
├── backend/          # API REST construida con NestJS
├── web/              # Interfaz de usuario con Next.js
├── docs/             # Documentacion unificada (Legal, Arquitectura, Producto)
├── data-science/     # Modelos y analisis de datos (En desarrollo)
└── mobile/           # App movil (En desarrollo)
```

---

## Inicio Rapido

### Requisitos Previos
- Node.js 18+
- PostgreSQL
- Administrador de paquetes npm o yarn

### Instalacion

1. **Clonar el repositorio**:
   ```bash
   git clone <https://github.com/guillermoSoftwareEngineer/MONETRIX.git>
   cd MONETRIX
   ```

2. **Configurar el Backend**:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. **Configurar el Frontend**:
   ```bash
   cd ../web
   npm install
   npm run dev
   ```

Acceso local: `http://localhost:3001`

---

## Documentacion
Para mas detalles sobre la arquitectura tecnica, politicas de seguridad y cumplimiento legal en Colombia, consulte el archivo de [Documentacion Completa](docs/DOCUMENTACION_COMPLETA_ES.md).

---

## Aviso Legal
Monedix es una herramienta de gestion personal. No proporciona asesoria financiera legal ni custodia fondos de terceros. Los datos ingresados son responsabilidad exclusiva del usuario.
