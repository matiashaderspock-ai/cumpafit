# Cumpafit en iPhone

URL: https://matiashaderspock-ai.github.io/cumpafit/

Una vez fusionado el PR y publicado el cambio en GitHub Pages:

1. Exportá y guardá el respaldo JSON desde la app vieja antes de borrarla.
2. Borrá la app vieja del iPhone.
3. Abrí la nueva URL en Safari y elegí Compartir → Agregar a pantalla de inicio.
4. Abrí Cumpafit, entrá a Respaldo de datos → Importar respaldo y seleccioná el JSON.
5. Comprobá tus ejercicios, fotos, rutinas y sesiones anteriores.

Cumpafit usa IndexedDB `cumpafit`, versión 1. No hay migración automática de la
base anterior. Los respaldos JSON de versión 1 conservan el mismo formato y
se pueden importar independientemente del nombre del archivo. La importación
reemplaza los datos del dispositivo después de confirmar.

`start_url` y `scope` se mantienen en `./`. Los recursos versionados y el caché
`cumpafit-v32` se publican juntos. Las próximas exportaciones se llaman
`cumpafit-AAAA-MM-DD.json`.
