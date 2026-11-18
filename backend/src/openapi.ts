const jsonResponse = (description: string, example: unknown = {}) => ({
  description,
  content: { 'application/json': { example } },
});

export const openapiDocument: Record<string, unknown> = {
  openapi: '3.0.3',
  info: {
    title: 'Turnos Odontología — API',
    version: '0.1.0',
    description:
      'API de gestión de turnos y agenda para consultorios odontológicos. Datos ficticios. ' +
      'El anti-solapamiento se garantiza en PostgreSQL mediante constraints EXCLUDE.',
  },
  servers: [{ url: '/', description: 'Servidor local' }],
  tags: [
    { name: 'Salud', description: 'Verificación del servicio' },
    { name: 'Turnos', description: 'Agenda, alta, reprogramación, cancelación y estados' },
    { name: 'Pacientes', description: 'Alta y consulta de pacientes ficticios' },
    { name: 'Configuración', description: 'Prestaciones, profesionales, sillones y horarios' },
    { name: 'Cobros', description: 'Cobros, señas y cierre de caja' },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Salud'],
        summary: 'Health check',
        responses: { 200: jsonResponse('Servicio activo', { status: 'ok', env: 'dev' }) },
      },
    },
    '/api/appointments': {
      post: {
        tags: ['Turnos'],
        summary: 'Crear turno (choque → 409 APPOINTMENT_OVERLAP)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['providerId', 'operatingUnitId', 'procedureId', 'patientName', 'start'],
                properties: {
                  providerId: { type: 'string' },
                  operatingUnitId: { type: 'string' },
                  procedureId: { type: 'string' },
                  patientName: { type: 'string', example: 'Paciente Ficticio' },
                  patientId: { type: 'string', description: 'Opcional: vincula al paciente' },
                  start: { type: 'string', format: 'date-time', example: '2026-11-20T10:00:00.000Z' },
                  status: { type: 'string', enum: ['pendiente', 'confirmado'] },
                },
              },
            },
          },
        },
        responses: {
          201: jsonResponse('Turno creado'),
          400: jsonResponse('Payload inválido'),
          404: jsonResponse('Referencia inexistente'),
          409: jsonResponse('Solape de profesional o sillón'),
        },
      },
      get: {
        tags: ['Turnos'],
        summary: 'Listar agenda (filtros date, providerId, operatingUnitId, status, includeCancelled)',
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'string', example: '2026-11-20' } },
          { name: 'providerId', in: 'query', schema: { type: 'string' } },
          { name: 'operatingUnitId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'includeCancelled', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: { 200: jsonResponse('Lista de turnos', []) },
      },
    },
    '/api/appointments/{id}': {
      get: {
        tags: ['Turnos'],
        summary: 'Obtener turno por id',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: jsonResponse('Turno'), 404: jsonResponse('Inexistente') },
      },
      patch: {
        tags: ['Turnos'],
        summary: 'Reprogramar turno (recalcula el fin según la prestación)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  start: { type: 'string', format: 'date-time' },
                  providerId: { type: 'string' },
                  operatingUnitId: { type: 'string' },
                  procedureId: { type: 'string' },
                  patientName: { type: 'string' },
                  patientId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: jsonResponse('Turno actualizado'), 409: jsonResponse('Solape o cancelado') },
      },
    },
    '/api/appointments/{id}/cancel': {
      post: {
        tags: ['Turnos'],
        summary: 'Cancelar turno y liberar el slot',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': { schema: { type: 'object', properties: { reason: { type: 'string' } } } },
          },
        },
        responses: { 200: jsonResponse('Turno cancelado') },
      },
    },
    '/api/appointments/{id}/status': {
      post: {
        tags: ['Turnos'],
        summary: 'Transición de estado (pendiente→confirmado|ausente, confirmado→atendido|ausente)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { status: { type: 'string', enum: ['confirmado', 'atendido', 'ausente'] } } },
            },
          },
        },
        responses: { 200: jsonResponse('Turno actualizado'), 409: jsonResponse('Transición inválida') },
      },
    },
    '/api/patients': {
      post: {
        tags: ['Pacientes'],
        summary: 'Alta de paciente (nombre + teléfono/email)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Paciente Ficticio' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                  dni: { type: 'string', example: '30111222' },
                },
              },
            },
          },
        },
        responses: { 201: jsonResponse('Paciente creado'), 409: jsonResponse('DNI duplicado') },
      },
      get: {
        tags: ['Pacientes'],
        summary: 'Listar pacientes (q, includeInactive)',
        responses: { 200: jsonResponse('Lista de pacientes', []) },
      },
    },
    '/api/patients/{id}': {
      get: {
        tags: ['Pacientes'],
        summary: 'Obtener paciente',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: jsonResponse('Paciente') },
      },
      patch: {
        tags: ['Pacientes'],
        summary: 'Editar paciente (baja lógica)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: jsonResponse('Paciente actualizado') },
      },
    },
    '/api/procedures': {
      get: { tags: ['Configuración'], summary: 'Listar prestaciones', responses: { 200: jsonResponse('Prestaciones', []) } },
      post: { tags: ['Configuración'], summary: 'Crear prestación (precio en centavos)', responses: { 201: jsonResponse('Prestación creada') } },
      patch: { tags: ['Configuración'], summary: 'Editar prestación', responses: { 200: jsonResponse('Prestación actualizada') } },
    },
    '/api/providers': {
      get: { tags: ['Configuración'], summary: 'Listar profesionales', responses: { 200: jsonResponse('Profesionales', []) } },
      post: { tags: ['Configuración'], summary: 'Crear profesional', responses: { 201: jsonResponse('Profesional creado') } },
      patch: { tags: ['Configuración'], summary: 'Editar profesional', responses: { 200: jsonResponse('Profesional actualizado') } },
    },
    '/api/operating-units': {
      get: { tags: ['Configuración'], summary: 'Listar sillones', responses: { 200: jsonResponse('Sillones', []) } },
      post: { tags: ['Configuración'], summary: 'Crear sillón', responses: { 201: jsonResponse('Sillón creado') } },
      patch: { tags: ['Configuración'], summary: 'Editar sillón', responses: { 200: jsonResponse('Sillón actualizado') } },
    },
    '/api/schedule/providers': {
      get: { tags: ['Configuración'], summary: 'Disponibilidad de profesionales', responses: { 200: jsonResponse('Profesionales con horarios', []) } },
    },
    '/api/schedule/sills': {
      get: { tags: ['Configuración'], summary: 'Disponibilidad de sillones', responses: { 200: jsonResponse('Sillones', []) } },
    },
    '/api/schedule/providers/{id}/schedules': {
      get: { tags: ['Configuración'], summary: 'Horarios de un profesional', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: jsonResponse('Horarios', []) } },
      post: { tags: ['Configuración'], summary: 'Alta de horario (sin solape en BD)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 201: jsonResponse('Horario creado') } },
    },
    '/api/payments': {
      post: {
        tags: ['Cobros'],
        summary: 'Registrar cobro o seña',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amountCents', 'type', 'method'],
                properties: {
                  appointmentId: { type: 'string' },
                  patientId: { type: 'string' },
                  amountCents: { type: 'integer', example: 5000 },
                  type: { type: 'string', enum: ['turno', 'sena'], description: 'sena = señal/anticipo' },
                  method: { type: 'string', enum: ['efectivo', 'tarjeta', 'mercadopago'] },
                },
              },
            },
          },
        },
        responses: { 201: jsonResponse('Pago registrado'), 400: jsonResponse('Seña sin turno') },
      },
      get: { tags: ['Cobros'], summary: 'Listar cobros', responses: { 200: jsonResponse('Cobros', []) } },
    },
    '/api/payments/{id}/annul': {
      post: {
        tags: ['Cobros'],
        summary: 'Anular cobro con motivo (sin borrar)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: jsonResponse('Cobro anulado') },
      },
    },
    '/api/cash/close': {
      get: {
        tags: ['Cobros'],
        summary: 'Cierre de caja por medio de pago y profesional',
        parameters: [{ name: 'date', in: 'query', required: true, schema: { type: 'string', example: '2026-11-20' } }],
        responses: { 200: jsonResponse('Cierre de caja') },
      },
    },
  },
};
