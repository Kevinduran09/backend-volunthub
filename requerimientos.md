# Requisitos de Implementación - VoluntHub Backend

## 1. Consultas GraphQL (Queries)

### Eventos
```graphql
# Obtener eventos con filtros opcionales
query {
  eventos(
    categoria: MEDIO_AMBIENTE
    nombre: "Limpieza"
    ubicacion: {
      latitud: 40.4168
      longitud: -3.7038
      radio: 10
    }
  ) {
    id
    nombre
    descripcion
    fecha_inicio
    fecha_fin
    estado
    categoria
    ubicacion {
      latitud
      longitud
      direccion
    }
    distancia # Solo se incluye cuando se proporciona ubicación
  }
}
```

#### Descripción de la Query:
- **Nombre**: `eventos`
- **Propósito**: Obtener una lista de eventos con filtros opcionales
- **Parámetros**:
  - `categoria`: Filtra eventos por categoría (opcional)
  - `nombre`: Busca eventos por nombre (opcional)
  - `ubicacion`: Filtra eventos por ubicación (opcional)
    - `latitud`: Coordenada de latitud
    - `longitud`: Coordenada de longitud
    - `radio`: Radio de búsqueda en kilómetros
- **Campos de Retorno**:
  - Información básica del evento (id, nombre, descripción)
  - Fechas de inicio y fin
  - Estado y categoría
  - Ubicación con coordenadas
  - Distancia (solo si se proporciona ubicación)
- **Consideraciones**:
  - Debe implementar paginación para grandes conjuntos de datos
  - Los filtros son opcionales y pueden combinarse
  - La distancia se calcula usando la fórmula de Haversine

### Detalles de Evento
```graphql
# Obtener un evento específico
query {
  evento(id: "123") {
    id
    nombre
    descripcion
    creador {
      id
      nombre
    }
  }
}

# Obtener evento con sus tareas
query {
  eventoConTareas(id: "123") {
    id
    nombre
    tareas {
      id
      titulo
      descripcion
      completada
    }
  }
}
```

#### Descripción de las Queries:
1. **Query: `evento`**
   - **Propósito**: Obtener detalles de un evento específico
   - **Parámetros**:
     - `id`: ID único del evento (requerido)
   - **Campos de Retorno**:
     - Información básica del evento
     - Información del creador
   - **Consideraciones**:
     - Debe manejar casos de evento no encontrado
     - Implementar caché por ID

2. **Query: `eventoConTareas`**
   - **Propósito**: Obtener un evento con todas sus tareas asociadas
   - **Parámetros**:
     - `id`: ID único del evento (requerido)
   - **Campos de Retorno**:
     - Información del evento
     - Lista de tareas con su estado
   - **Consideraciones**:
     - Optimizar carga de tareas usando DataLoader
     - Implementar paginación para eventos con muchas tareas

### Usuario y Participación
```graphql
# Información del usuario
query {
  usuario(id: "456") {
    id
    nombre
    email
    eventos_creados {
      id
      nombre
    }
    eventos_inscritos {
      id
      nombre
    }
  }
}

# Mis eventos creados
query {
  misEventosCreados {
    id
    nombre
    estado
  }
}

# Mis eventos inscritos
query {
  misEventosInscritos {
    id
    nombre
    fecha_inicio
  }
}

# Participantes de un evento
query {
  participantesEvento(eventoId: "123") {
    id
    nombre
    email
  }
}

# Completadores de una tarea
query {
  completadoresTarea(tareaId: "789") {
    id
    nombre
    fecha_completado
  }
}
```

#### Descripción de las Queries:
1. **Query: `usuario`**
   - **Propósito**: Obtener información detallada de un usuario
   - **Parámetros**:
     - `id`: ID único del usuario (requerido)
   - **Campos de Retorno**:
     - Información básica del usuario
     - Eventos creados e inscritos
   - **Consideraciones**:
     - Requiere autenticación
     - Implementar control de acceso

2. **Query: `misEventosCreados`**
   - **Propósito**: Obtener eventos creados por el usuario actual
   - **Parámetros**: Ninguno (usa el usuario autenticado)
   - **Campos de Retorno**:
     - Lista de eventos creados
   - **Consideraciones**:
     - Requiere autenticación
     - Implementar paginación

3. **Query: `misEventosInscritos`**
   - **Propósito**: Obtener eventos donde el usuario está inscrito
   - **Parámetros**: Ninguno (usa el usuario autenticado)
   - **Campos de Retorno**:
     - Lista de eventos inscritos
   - **Consideraciones**:
     - Requiere autenticación
     - Implementar paginación

4. **Query: `participantesEvento`**
   - **Propósito**: Obtener lista de participantes de un evento
   - **Parámetros**:
     - `eventoId`: ID del evento (requerido)
   - **Campos de Retorno**:
     - Lista de participantes
   - **Consideraciones**:
     - Implementar paginación
     - Optimizar para grandes eventos

5. **Query: `completadoresTarea`**
   - **Propósito**: Obtener usuarios que completaron una tarea
   - **Parámetros**:
     - `tareaId`: ID de la tarea (requerido)
   - **Campos de Retorno**:
     - Lista de completadores con fecha
   - **Consideraciones**:
     - Implementar paginación
     - Ordenar por fecha de completado

## 2. Mutaciones GraphQL

### Gestión de Eventos
```graphql
# Crear evento
mutation {
  crearEvento(input: {
    nombre: "Limpieza de Playa"
    descripcion: "Jornada de limpieza en la playa"
    fecha_inicio: "2024-04-01T10:00:00Z"
    fecha_fin: "2024-04-01T14:00:00Z"
    categoria: MEDIO_AMBIENTE
    ubicacion: {
      latitud: 40.4168
      longitud: -3.7038
      direccion: "Playa Principal"
    }
  }) {
    id
    nombre
  }
}
```

#### Descripción de la Mutación:
- **Nombre**: `crearEvento`
- **Propósito**: Crear un nuevo evento
- **Parámetros**:
  - `input`: Objeto con datos del evento
    - `nombre`: Nombre del evento (requerido)
    - `descripcion`: Descripción detallada (requerido)
    - `fecha_inicio`: Fecha y hora de inicio (requerido)
    - `fecha_fin`: Fecha y hora de fin (requerido)
    - `categoria`: Categoría del evento (requerido)
    - `ubicacion`: Datos de ubicación (requerido)
- **Campos de Retorno**:
  - ID y nombre del evento creado
- **Consideraciones**:
  - Requiere autenticación
  - Validar fechas y coordenadas
  - Implementar transacciones

### Gestión de Tareas
```graphql
# Crear tarea
mutation {
  crearTarea(input: {
    eventoId: "123"
    titulo: "Recoger plásticos"
    descripcion: "Recoger plásticos de la playa"
  }) {
    id
    titulo
  }
}

# Completar tarea
mutation {
  completarTarea(tareaId: "789") {
    id
    completada
    completada_por {
      id
      nombre
    }
  }
}
```

#### Descripción de las Mutaciones:
1. **Mutación: `crearTarea`**
   - **Propósito**: Crear una nueva tarea para un evento
   - **Parámetros**:
     - `input`: Objeto con datos de la tarea
       - `eventoId`: ID del evento (requerido)
       - `titulo`: Título de la tarea (requerido)
       - `descripcion`: Descripción detallada (requerido)
   - **Campos de Retorno**:
     - ID y título de la tarea creada
   - **Consideraciones**:
     - Requiere autenticación
     - Validar permisos de creación

2. **Mutación: `completarTarea`**
   - **Propósito**: Marcar una tarea como completada
   - **Parámetros**:
     - `tareaId`: ID de la tarea (requerido)
   - **Campos de Retorno**:
     - Estado de completado
     - Información del completador
   - **Consideraciones**:
     - Requiere autenticación
     - Validar que el usuario esté inscrito en el evento

### Participación en Eventos
```graphql
# Inscribirse a evento
mutation {
  inscribirseEvento(eventoId: "123") {
    success
    mensaje
  }
}

# Desinscribirse de evento
mutation {
  desinscribirseEvento(eventoId: "123") {
    success
    mensaje
  }
}
```

#### Descripción de las Mutaciones:
1. **Mutación: `inscribirseEvento`**
   - **Propósito**: Inscribir al usuario actual en un evento
   - **Parámetros**:
     - `eventoId`: ID del evento (requerido)
   - **Campos de Retorno**:
     - Estado de la operación
     - Mensaje descriptivo
   - **Consideraciones**:
     - Requiere autenticación
     - Validar límites de participantes
     - Manejar lista de espera

2. **Mutación: `desinscribirseEvento`**
   - **Propósito**: Cancelar la inscripción del usuario en un evento
   - **Parámetros**:
     - `eventoId`: ID del evento (requerido)
   - **Campos de Retorno**:
     - Estado de la operación
     - Mensaje descriptivo
   - **Consideraciones**:
     - Requiere autenticación
     - Validar que el usuario esté inscrito
     - Manejar notificaciones

## 3. Suscripciones GraphQL

```graphql
# Suscripción a tarea completada
subscription {
  tareaCompletada {
    tarea {
      id
      titulo
    }
    completada_por {
      id
      nombre
    }
    fecha_completado
  }
}

# Suscripción a cambio de estado de evento
subscription {
  cambioEstadoEvento {
    evento {
      id
      nombre
      estado
    }
    fecha_cambio
  }
}

# Suscripción a evento próximo a comenzar
subscription {
  eventoProximoComenzar {
    evento {
      id
      nombre
      fecha_inicio
    }
    tiempo_restante
  }
}
```

### Descripción de las Suscripciones

1. **Suscripción: `tareaCompletada`**
   - **Propósito**: Notificar en tiempo real cuando una tarea es completada
   - **Campos de Retorno**:
     - `tarea`: Información de la tarea completada
     - `completada_por`: Usuario que completó la tarea
     - `fecha_completado`: Timestamp de la completación
   - **Consideraciones**:
     - Implementar filtrado por evento/tarea específica
     - Manejar reconexiones automáticas
     - Implementar rate limiting por usuario

2. **Suscripción: `cambioEstadoEvento`**
   - **Propósito**: Notificar cambios en el estado de un evento
   - **Campos de Retorno**:
     - `evento`: Información del evento actualizado
     - `fecha_cambio`: Timestamp del cambio
   - **Consideraciones**:
     - Notificar a todos los participantes
     - Manejar diferentes tipos de cambios de estado
     - Implementar sistema de retry para mensajes fallidos

3. **Suscripción: `eventoProximoComenzar`**
   - **Propósito**: Notificar cuando un evento está próximo a comenzar
   - **Campos de Retorno**:
     - `evento`: Información del evento
     - `tiempo_restante`: Tiempo hasta el inicio
   - **Consideraciones**:
     - Configurar intervalo de notificación (ej: 24h, 1h antes)
     - Manejar diferentes zonas horarias
     - Implementar sistema de recordatorios

