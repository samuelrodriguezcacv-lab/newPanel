# Herramientas Logistica

Aplicacion interna de logistica hecha con Laravel, Inertia, React y Tailwind. Centraliza tareas logisticas y separa los flujos de sellos, metacrilatos y pedidos a proveedores.

## Stack

- Laravel 12
- PHP 8.2+
- Inertia Laravel
- React 18
- Tailwind CSS
- Vite
- MySQL o MariaDB
- PDFtk Server para rellenar plantillas PDF de metacrilatos
- DomPDF para albaranes de proveedores

## Modulos

### Tareas logisticas

Tabla principal: `tareas_logistica`.

Es el panel operativo. Una tarea puede ser de tipo:

- `sellos`
- `metacrilato`
- `anulacion`
- `devolucion`
- `carnets`
- `otro`

Desde una tarea de sellos se abre el flujo de nuevo pedido de sellos. Desde una tarea de metacrilato se abre el flujo de metacrilatos.

### Sellos

Tablas principales:

- `All_sellos`
- `pedidos`
- `tarea_sello`
- `tareas_logistica`

`pedidos` representa pedidos de sellos. El nombre historico es generico, pero funcionalmente son pedidos de sellos.

Flujo:

1. Se usa el pedido de sellos abierto.
2. Si no existe pedido abierto, se crea automaticamente.
3. Los sellos se acumulan en la tarea activa.
4. Al confirmar, se guardan en `tarea_sello`.
5. Al cerrar el pedido, el siguiente sello entra en un pedido nuevo o abierto.

### Metacrilatos

Tablas principales:

- `metacrilatos`
- `pedidos_metacrilatos`
- `tareas_logistica`

Flujo:

1. Se usa el pedido de metacrilatos abierto.
2. Si no existe pedido abierto, se crea automaticamente.
3. Cada metacrilato guarda su tarea logistica y su pedido de metacrilatos.
4. Al cerrar el pedido, los proximos metacrilatos entran en otro pedido abierto/nuevo.
5. Los PDF se rellenan con PDFtk usando `Plantilla.pdf`.

### Envio a proveedores

Tablas principales:

- `proveedores`
- `productos`
- `colegios_veterinarios`
- `pedidos_colegios`
- `pedido_lineas`

Flujo:

1. Se selecciona proveedor.
2. Se selecciona colegio veterinario.
3. Se agregan lineas de productos.
4. Se genera pedido, albaran PDF y correo con adjunto.
5. El estado del pedido puede actualizarse desde el panel.

## Relaciones principales

```text
tareas_logistica
  ├─ tarea_sello
  │    ├─ All_sellos
  │    └─ pedidos
  │
  └─ metacrilatos
       └─ pedidos_metacrilatos

proveedores
  ├─ productos
  └─ pedidos_colegios
       └─ pedido_lineas

colegios_veterinarios
  └─ pedidos_colegios
```

## Pedido abierto automatico

La aplicacion usa una regla importante:

```text
Si hay un pedido abierto, todo entra ahi.
Si no hay pedido abierto, se crea uno automaticamente.
Cuando se cierra, lo siguiente entra en otro pedido.
```

Esto aplica a:

- pedidos de sellos (`pedidos`)
- pedidos de metacrilatos (`pedidos_metacrilatos`)

## Estructura frontend

El frontend sigue una estructura tipo atomic design:

```text
resources/js/Components/atoms
resources/js/Components/molecules
resources/js/Components/organisms
resources/js/Pages
resources/js/Hooks
resources/js/Services
```

Componentes relevantes:

- `Components/molecules/FeedbackModal.jsx`: modal reutilizable para avisos y confirmaciones.
- `Hooks/useFeedbackModal.jsx`: hook para reemplazar `alert()` y `confirm()`.
- `Components/Modal.jsx`: modal base con Headless UI.

## Instalacion

1. Instalar dependencias PHP:

```bash
composer install
```

2. Instalar dependencias frontend:

```bash
npm install
```

3. Crear entorno:

```bash
cp .env.example .env
php artisan key:generate
```

4. Configurar base de datos en `.env`.

5. Ejecutar migraciones:

```bash
php artisan migrate
```

6. Compilar frontend:

```bash
npm run build
```

## Desarrollo

Levantar Vite:

```bash
npm run dev
```

Levantar Laravel:

```bash
php artisan serve
```

Tambien existe el script:

```bash
composer run dev
```

que arranca servidor, cola, logs y Vite.

## PDFtk

Para metacrilatos se necesita PDFtk Server. La ruta por defecto esta configurada en `config/services.php`:

```text
C:\Program Files (x86)\PDFtk Server\bin\pdftk.exe
```

Se puede sobrescribir en `.env`:

```env
PDFTK_BINARY="C:\Program Files (x86)\PDFtk Server\bin\pdftk.exe"
```

Plantillas compatibles:

- `storage/app/Plantilla.pdf`
- `public/templates/Plantilla.pdf`

El controlador rellena ambos pares de campos conocidos:

- `tipo_veterinario` / `Texto2`
- `tipo_centro` / `registro_num`

## Comandos utiles

Listar rutas:

```bash
php artisan route:list
```

Ejecutar tests:

```bash
php artisan test
```

Compilar frontend:

```bash
npm run build
```

Importadores historicos de sellos:

```bash
php artisan sellos:importar198
php artisan sellos:importar199
php artisan sellos:importar200
php artisan sellos:importar201
php artisan sellos:importar202
php artisan sellos:importar203
```

## Rutas principales

- `/dashboard`
- `/tareas-logistica`
- `/sellos/pedidos/nuevo-pedido`
- `/sellos/pedidos`
- `/sellos/tareas`
- `/sellos/gestion/todos`
- `/metacrilatos`
- `/metacrilatos/pedidos`
- `/metacrilatos/tareas`
- `/envio-proveedores`

## Seguridad

`.env` esta ignorado por Git. Si existe un archivo como `.env.rar` con credenciales reales, debe eliminarse del repositorio antes de publicar o subir el proyecto.

## Verificacion actual

Comandos usados para validar:

```bash
php artisan test
npm run build
```

Los tests existentes cubren sobre todo autenticacion y perfil. Conviene anadir tests de flujo para sellos, metacrilatos y proveedores.
