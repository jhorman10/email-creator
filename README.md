# Email Creator - Generador de Correos Personalizados

Una aplicación web moderna desarrollada con React 19 que permite cargar archivos Excel y generar correos electrónicos personalizados de forma masiva.

## 🚀 Características

- **📊 Carga de archivos Excel**: Soporte para formatos XLSX, XLS y CSV con drag & drop
- **✉️ Editor de plantillas**: Crea plantillas de correo con campos dinámicos
- **🔗 Mapeo inteligente**: Conecta automáticamente los campos con las columnas del Excel
- **📧 Generación masiva**: Genera correos personalizados para cada fila de datos
- **💾 Exportación múltiple**: Descarga en formato TXT o CSV, copia al portapapeles

## 🛠️ Tecnologías

- React 19 + TypeScript
- Vite
- Tailwind CSS
- XLSX (lectura de Excel)
- React Dropzone
- Lucide React (iconos)

## 🎯 Uso

1. **Cargar Excel**: Arrastra tu archivo Excel con los datos
2. **Crear Plantilla**: Escribe tu correo usando placeholders como {{NOMBRE}}, {{CEDULA}}
3. **Mapear Campos**: Conecta los placeholders con las columnas del Excel
4. **Generar Correos**: Revisa, navega y exporta tus correos personalizados

## 🚀 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/jhorman10/email-creator.git

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📝 Ejemplo de Uso

Perfecto para casos como:
- Envío de notificaciones masivas
- Correos de inscripción a cursos
- Comunicaciones personalizadas con clientes
- Invitaciones a eventos

Desarrollado con ❤️ por [Jhorman Orozco](https://github.com/jhorman10)
