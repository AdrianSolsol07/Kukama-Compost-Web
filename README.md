# Kukama Compost

Sitio web público responsive para Kukama Compost. Abre `index.html` en un navegador para visualizarlo.

## Siguiente integración

Los formularios funcionan localmente y no transmiten datos. La carta de voluntariado se prepara y descarga en el dispositivo de la persona usuaria.

Para recibir solicitudes reales, se puede conectar el sitio a Firebase Firestore o a un servicio de correo. El acceso interno está implementado como prototipo, pero permanece oculto hasta que se apruebe el panel de administración y su sistema de autenticación.

## Estructura del proyecto

```text
KCweb/
├── assets/
│   ├── css/        # Hojas de estilo organizadas
│   ├── js/         # Scripts y lógica interactiva
│   └── images/     # Fotografías, iconos SVG y recursos gráficos
├── index.html      # Página principal
├── comunidades.html
├── voluntariado.html
├── compostaje.html
├── educacion-ambiental.html
├── comercio-con-sentido.html
├── README.md
└── .gitignore
```

## Recursos visuales

El sitio usa versiones WebP optimizadas para las imágenes principales ubicadas en `assets/images/`. Los archivos JPG y PNG originales se conservan como fuentes para futuras ediciones.
