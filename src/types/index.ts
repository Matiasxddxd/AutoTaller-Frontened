export type UserRole = 'admin' | 'mecanico' | 'cliente'

export type OrderStatus   = 'pendiente' | 'en_proceso' | 'terminado' | 'entregado'
export type QuoteStatus   = 'borrador'  | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'
export type ItemType      = 'repuesto'  | 'mano_de_obra' | 'otro'
export type OrderPriority = 'baja' | 'normal' | 'alta' | 'urgente'

export interface User {
  id: string
  email: string
  role: UserRole
}

export interface Cliente {
  id: string
  nombre: string
  telefono?: string
  email?: string
  rut?: string
  direccion?: string
  notas?: string
  total_vehiculos?: number
  total_ordenes?: number
  created_at: string
}

export interface Vehiculo {
  id: string
  cliente_id: string
  cliente_nombre?: string
  cliente_telefono?: string
  marca: string
  modelo: string
  anio?: number
  patente: string
  vin?: string
  color?: string
  kilometraje?: number
  combustible: string
  notas?: string
  historial_ordenes?: OrdenTrabajo[]
}

export interface Repuesto {
  id: string
  nombre: string
  codigo_sku?: string
  precio_venta: number
  precio_costo: number
  stock: number
  stock_minimo: number
  stock_critico?: boolean
  unidad: string
  activo: boolean
}

export interface CotizacionItem {
  id?: string
  repuesto_id?: string
  repuesto_nombre?: string
  tipo: ItemType
  descripcion: string
  cantidad: number
  precio_unitario: number
  subtotal?: number
}

export interface Cotizacion {
  id: string
  cliente_id: string
  cliente_nombre?: string
  cliente_telefono?: string
  vehiculo_id: string
  marca?: string
  modelo?: string
  patente?: string
  estado: QuoteStatus
  subtotal: number
  iva: number
  total: number
  notas?: string
  vencimiento?: string
  pdf_url?: string
  items?: CotizacionItem[]
  created_at: string
}

export interface OrdenTrabajo {
  id: string
  vehiculo_id: string
  mecanico_id?: string
  sucursal_id?: string
  cotizacion_id?: string
  estado: OrderStatus
  prioridad: OrderPriority
  diagnostico?: string
  notas_internas?: string
  kilometraje_ingreso?: number
  fecha_ingreso: string
  fecha_estimada?: string
  fecha_entrega?: string
  // joins
  marca?: string
  modelo?: string
   anio?: number 
  patente?: string
  color?: string
  cliente_nombre?: string
  cliente_telefono?: string
  mecanico_nombre?: string
  historial?: EstadoHistorial[]
  servicios?: ServicioRealizado[]
  created_at: string
}

export interface EstadoHistorial {
  id: string
  orden_id: string
  usuario_email?: string
  estado_anterior?: string
  estado_nuevo: string
  comentario?: string
  created_at: string
}

export interface ServicioRealizado {
  id: string
  orden_id: string
  mecanico_nombre?: string
  descripcion: string
  observaciones?: string
  horas_trabajo?: number
  fecha_hora: string
}

export interface DashboardData {
  ordenes_por_estado: { estado: OrderStatus; total: number }[]
  ingresos: {
    total_mes: number
    promedio_orden: number
    total_cotizaciones: number
  }
  rendimiento_mecanicos: {
    nombre: string
    ordenes_completadas: number
    horas_totales: number
  }[]
  alertas_stock_bajo: Repuesto[]
  periodo: { mes: number; anio: number }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface AuthResponse {
  token: string
  user: User
}
