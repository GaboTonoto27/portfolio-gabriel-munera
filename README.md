<div align="center">

# 🎨 Portafolio Personal — Gabriel Munera

**Frontend Developer · Técnico en Programación de Software · Aprendiz ADSO**

[![Vercel](https://img.shields.io/badge/Vercel-Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio-gabriel-munera.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

[🚀 Ver en vivo](https://portfolio-gabriel-munera.vercel.app) · [🐛 Reportar bug](https://github.com/GaboTonoto27/portfolio-gabriel-munera/issues) · [💡 Sugerir mejora](https://github.com/GaboTonoto27/portfolio-gabriel-munera/issues)

</div>

---

## 📖 Sobre el proyecto

Portafolio personal construido desde cero para mostrar mi perfil como **desarrollador frontend**, mis proyectos, certificaciones y habilidades técnicas.

Diseñado con un enfoque en **rendimiento, accesibilidad y experiencia de usuario**, incluye funcionalidades modernas como modo claro/oscuro, animaciones personalizadas y un sistema de temas basado en variables CSS.

> 🎯 **Objetivo:** Conseguir prácticas profesionales o mi primera oportunidad como desarrollador frontend junior.

---

## ✨ Características

- 🎨 **Modo claro / oscuro** con persistencia en `localStorage`
- 🖱️ **Cursor personalizado** que se adapta al tema activo
- ⌨️ **Efecto typewriter** animado en el Hero con múltiples frases
- ✨ **Partículas de fondo** con líneas dinámicas conectadas (Canvas API)
- 🎬 **Animaciones de scroll** con Intersection Observer
- 📱 **Diseño totalmente responsive** (móvil, tablet, desktop)
- 📄 **Visor de certificaciones** con modal y descarga de PDFs
- 🌐 **Enlaces de contacto pre-rellenados** (mailto con asunto y cuerpo)
- 🎯 **Navegación suave** entre secciones (scroll-behavior)
- 🚀 **CI/CD automático** (Figma Make → GitHub → Vercel)

---

## 🛠️ Stack técnico

### Frontend

| Tecnología | Uso |
| :--- | :--- |
| **React 19** | Biblioteca principal de UI |
| **TypeScript** | Tipado estático |
| **Vite** | Bundler y dev server |
| **Tailwind CSS** | Estilos utilitarios y sistema de diseño |

### Herramientas

| Herramienta | Uso |
| :--- | :--- |
| **Figma Make** | Diseño y generación inicial del código |
| **GitHub** | Control de versiones |
| **Vercel** | Hosting y deploy automático |
| **pnpm** | Gestor de paquetes |

### APIs del navegador

- **Canvas API** — Sistema de partículas
- **Intersection Observer** — Animaciones al hacer scroll
- **localStorage** — Persistencia del tema
- **`prefers-color-scheme`** — Detección del tema del sistema

---

## 📂 Estructura del proyecto

```text
portfolio-gabriel-munera/
├── public/
│   ├── certs/                    # PDFs de certificaciones
│   ├── gabriel-photo.png         # Foto de perfil
│   └── cv-gabriel-munera.pdf     # CV descargable
├── src/
│   ├── components/
│   │   └── Particles.tsx         # Fondo de partículas animadas
│   ├── context/
│   │   └── ThemeContext.tsx      # Sistema de temas (claro/oscuro)
│   ├── hooks/
│   │   └── useTypewriter.ts      # Hook del efecto typewriter
│   ├── App.tsx                   # Componente principal
│   ├── index.css                 # Estilos globales y variables de tema
│   └── main.tsx                  # Punto de entrada
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
🚀 Ejecutar localmente
Requisitos previos
Node.js 20+ (descargar)

pnpm (instalar) o npm

Pasos
Clona el repositorio

bash
git clone https://github.com/GaboTonoto27/portfolio-gabriel-munera.git
cd portfolio-gabriel-munera
Instala las dependencias

bash
pnpm install
# o si usas npm:
npm install
Inicia el servidor de desarrollo

bash
pnpm dev
# o:
npm run dev
Abre el navegador en http://localhost:5173

Compilar para producción
bash
pnpm build
pnpm preview
🎨 Personalización
Cambiar colores del tema
Todos los colores se gestionan con variables CSS en src/index.css. Modifica las variables dentro de :root (modo oscuro) y .light (modo claro):

css
:root, .dark {
  --bg: #080c10;
  --fg: #e2e8f0;
  --primary: #00d4aa;
}

.light {
  --bg: #f8fafc;
  --fg: #0f172a;
  --primary: #00a88a;
}
Añadir un nuevo proyecto
En src/App.tsx, busca el array projects y añade un objeto:

tsx
{
  title: "Nombre del proyecto",
  desc: "Descripción breve.",
  tags: ["React", "TypeScript"],
  img: "URL de la imagen",
  status: "Completado",
  demo: "https://demo.vercel.app",
  repo: "https://github.com/usuario/repo",
}
Añadir una nueva certificación
En src/App.tsx, busca el array certDocs, sube el PDF a public/certs/ y añade una entrada.

🔄 Flujo de trabajo
El proyecto usa un pipeline CI/CD automático:

text
┌──────────────┐    push    ┌─────────────┐    webhook    ┌────────────┐
│ Figma Make   │ ─────────▶ │  GitHub     │ ────────────▶ │  Vercel    │
│ (edición)    │            │ (repo)      │               │  (deploy)  │
└──────────────┘            └─────────────┘               └────────────┘
Editar en Figma Make.

Push a GitHub desde Figma Make (Configuración → GitHub).

Vercel detecta el cambio y hace deploy automático en ~1 minuto.

📊 Rendimiento
Resultados de PageSpeed Insights para la versión en producción:

Métrica	Desktop	Mobile
Performance	🟢 95+	🟢 90+
Accessibility	🟢 100	🟢 100
Best Practices	🟢 100	🟢 100
SEO	🟢 100	🟢 100
📫 Contacto
Gabriel Munera — Frontend Developer

🌐 Portafolio: portfolio-gabriel-munera.vercel.app

📧 Email: gabrielmunerarocha@gmail.com

💼 LinkedIn: gabriel-andres-múnera-rocha

🐙 GitHub: @GaboTonoto27

📄 Licencia
Este proyecto está bajo la licencia MIT. Puedes usarlo como inspiración para tu propio portafolio, pero por favor no copies el contenido personal (foto, certificaciones, textos).

<div align="center">
Hecho con ❤️ por Gabriel Munera

⭐ ¡Si te gustó el proyecto, dale una estrella!

</div> ```
