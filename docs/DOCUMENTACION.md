# 📄 DOCUMENTACIÓN COMPLETA - MONEDIX

Este documento unifica toda la base normativa, técnica y operativa del proyecto Monedix, consolidando los 18 documentos originales de gobernanza y regulación.

---

## 1. Fundamentos y Visión (Briefing)
Monedix es la apuesta por democratizar la salud financiera en Colombia a través de tecnología accesible, psicología conductual y gamificación.

- **Objetivo**: Ser la app de finanzas personales #1 de Colombia.
- **Diferenciador**: Gamificación (Asesor Gastón) + Análisis Predictivo.
- **Público**: Jóvenes adultos que buscan orden financiero sin complicaciones.
- **Restricción Crítica**: Monedix **no** custodia dinero ni ofrece asesoría financiera legal bajo la normativa colombiana actual.

---

## 2. Marco Legal y Regulatorio
Monedix opera bajo el estricto cumplimiento de la normativa colombiana:

- **Habeas Data**: Ley 1266 de 2008 y Ley 1581 de 2012.
- **Open Finance**: Alineación con la Circular SFC 078 de 2024.
- **Tratamiento de Datos**: Se procesan ingresos, gastos y metas. **No** se tratan datos biométricos ni sensibles de salud.
- **Obligaciones**: Registro ante la SIC (RNBD) y mantenimiento de certificados de "No Asesoría".

---

## 3. Arquitectura Técnica y Stack
El sistema está diseñado para ser escalable, seguro y resiliente:

- **Frontend**: Next.js 15 (Web) y Flutter (Mobile).
- **Backend**: Microservicios en NestJS (Node.js).
- **Base de Datos**: PostgreSQL para transacciones y ClickHouse para analítica.
- **Seguridad**: Autenticación JWT, Owen MASVS, Encriptación AES-256 para datos sensibles.
- **Infraestructura**: Despliegue en Render/Docker, CI/CD con GitHub Actions.

---

## 4. Gobernanza y Gestión del Proyecto
El proyecto se rige por una estructura de roles clara (Matriz RACI):

- **Roles Clave**: Founder (Visión), Compliance Officer (Legal), Security Champion (Ciberseguridad), Lead Architect (Código).
- **Toma de Decisiones**: Modelo basado en jerarquía por áreas. Los cambios críticos de seguridad requieren aprobación dual.
- **Escalamiento**: Protocolos definidos para incidentes técnicos (< 2h) e incidentes legales/seguridad (< 24h).

---

## 5. Políticas de Operación y Seguridad
- **Cero Confianza (Zero Trust)**: Mínimo privilegio para todos los accesos.
- **Seguridad por Diseño**: Auditorías de código periódicas y uso de bóvedas de secretos (Vault).
- **Gestión de Riesgos**: Monitoreo constante de riesgos de liquidez (para el usuario), riesgos de crédito y riesgos tecnológicos.
- **Gobierno de Datos**: Implementación de linaje de datos y políticas de retención.

---

## 6. Metodología de Desarrollo
- **Definition of Ready (DoR)**: Requerimientos claros antes de codificar.
- **Definition of Done (DoD)**: Código revisado, pruebas unitarias aprobadas y documentación actualizada.
- **Gestión de Cambios**: Uso de Pull Requests obligatorios y ambientes de Sandbox para pruebas controladas.

---

## 7. Diseño de Activos e Identidad Visual
Para mantener la coherencia estética de Monedix, se han definido los siguientes lineamientos para la generación de activos:

### Personaje: Gastón (Asesor Financiero)
Gastón es el centro de la experiencia de gamificación. Su diseño busca equilibrar profesionalismo con empatía.

**Prompt de Generación (IA):**
> "A friendly, professional financial advisor monster named Gastón. He is a small, cute creature with a sophisticated look, wearing small glasses and holding a digital tablet. He has a soft, colorful fur (blue and teal) and a supportive expression. The style is 3D glassmorphism, high quality, with a clean dark background, suitable for a premium fintech app."

### Estética Visual
- **Colores**: Uso de gradientes oscuros, azules eléctricos y acentos en verde esmeralda.
- **Efectos**: Glassmorphism (efecto cristal) en modales y tarjetas para un sentimiento "premium".
- **Tipografía**: Fuentes modernas sin serifa (ej. Inter o Roboto).

---

## 8. Historial de Implementación (Walkthrough)

Hasta la fecha, se han completado las siguientes fases:

### Fase 1: Base y Autenticación
- Sistema de Login/Registro robusto.
- Dashboard inicial de finanzas.

### Fase 2: Gamificación y Reportes
- **Sistema de XP y Niveles**: Los usuarios ganan experiencia por su disciplina.
- **Asesor Gastón**: Feedback visual dinámico basado en el estado financiero.
- **Reportes PDF**: Generación de extractos de movimientos con diseño premium.
- **Multidivisa**: Soporte para registros en COP, USD y EUR con conversión automática al balance consolidado.
- **Recordatorios**: Sistema de notificaciones automáticas.

### Fase 3: Analítica y Presupuestos Dinámicos (COMPLETO)
- **Gestión Total**: El usuario puede crear, editar y eliminar sus propias categorías de presupuesto.
- **Motor de Analítica**: Gráficos de tendencias históricas y variaciones mes a mes.
- **Detección de Anomalías**: Alertas visuales cuando se supera un límite establecido.
- **Bug Fix**: Corrección del error de eliminación de registros financiero.

---

## 9. Próximos Pasos (Roadmap)
- Implementación de Modelos de ML para predicción de gastos.
- Lanzamiento de la versión Mobile (Flutter).
- Integración con APIs de banca abierta (Open Banking) según disponibilidad técnica.

---

**Nota Final**: Este documento es la única fuente de verdad para la operación de Monedix. Cualquier cambio en la arquitectura o política debe reflejarse aquí tras su aprobación por el comité técnico.
