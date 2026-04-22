# AutoTaller — Frontend

Interfaz web del sistema de gestión de taller mecánico.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS (dark mode) |
| Estado global | Zustand |
| Fetching | TanStack Query v5 |
| Formularios | React Hook Form |
| Gráficos | Recharts |
| Tiempo real | Socket.io client |
| Routing | React Router v6 |
| Notificaciones | React Hot Toast |
| HTTP | Axios |

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# → Editar VITE_API_URL con la URL de tu backend

# 3. Iniciar en modo desarrollo
npm run dev
```

La app queda en `http://localhost:5173`

---

## Variables de entorno

```bash
VITE_API_URL=http://localhost:3000/api
```

---

## Páginas y rutas

| Ruta | Página | Roles |
|------|--------|-------|
| `/login` | Inicio de sesión | Todos |
| `/dashboard` | Métricas y panel | Admin |
| `/orders` | Lista de órdenes | Admin, Mecánico |
| `/orders/:id` | Detalle de orden | Admin, Mecánico |
| `/clients` | Lista de clientes | Admin, Mecánico |
| `/clients/:id` | Detalle de cliente | Admin, Mecánico |
| `/vehicles` | Lista de vehículos | Admin, Mecánico |
| `/quotes` | Cotizaciones | Admin, Mecánico |
| `/repuestos` | Inventario | Admin |

---

## Estructura del proyecto

```
src/
├── api/
│   ├── client.ts      → Axios con interceptores JWT
│   └── index.ts       → Funciones tipadas por módulo
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx      → Layout con sidebar
│   │   ├── Sidebar.tsx        → Navegación lateral
│   │   └── ProtectedRoute.tsx → Guard de rutas + roles
│   └── ui/
│       └── index.tsx  → Modal, Badge, Spinner, StatCard, etc.
├── hooks/
│   └── useOrderSocket.ts → WebSocket para estados en tiempo real
├── lib/
│   └── utils.ts       → Formatters, status labels, cn()
├── pages/
│   ├── auth/          → LoginPage
│   ├── dashboard/     → DashboardPage con métricas
│   ├── orders/        → OrdersPage + OrderDetailPage + NewOrderModal
│   ├── clients/       → ClientsPage + ClientDetailPage
│   ├── vehicles/      → VehiclesPage
│   ├── quotes/        → QuotesPage (con builder de ítems)
│   └── repuestos/     → RepuestosPage (inventario)
├── stores/
│   └── authStore.ts   → Zustand — usuario y token
├── types/
│   └── index.ts       → Tipos TypeScript compartidos
├── App.tsx            → Router principal
├── main.tsx           → Entry point
└── index.css          → Tailwind + design system
```

---

## Funcionalidades por página

### Login
- Formulario de autenticación con validación
- Redirige según el rol del usuario al autenticarse

### Dashboard (admin)
- Métricas del mes: ingresos, promedio, cotizaciones
- Gráfico de barras de órdenes por estado
- Tabla de rendimiento por mecánico
- Alertas de stock bajo

### Órdenes
- Filtros por estado con tabs
- Búsqueda por patente, cliente o mecánico
- Cambio de estado directo desde la lista
- Detalle completo: datos, historial de estados, servicios registrados
- Actualizaciones en tiempo real vía WebSocket

### Clientes
- Lista paginada con búsqueda
- Detalle con vehículos y últimas órdenes

### Vehículos
- Lista con búsqueda por patente, marca, modelo
- Registro con asociación a cliente (buscador en vivo)

### Cotizaciones
- Builder de ítems (repuestos + mano de obra) con totales automáticos
- Aprobar / rechazar con un clic
- Descarga de PDF directo desde la tabla

### Repuestos
- Tabla con costo, precio venta y margen calculado
- Alerta visual de stock crítico
- Ajuste de stock con campo de motivo
```

---

## Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@autotaller.cl | Admin1234! |
| Mecánico | juan@autotaller.cl | Mec12345! |
