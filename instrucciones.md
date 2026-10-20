## Instrucciones rápidas

Requisito recomendado: Docker Desktop iniciado. No es necesario instalar Node, npm ni SQLite.

### Ejecutar pruebas con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build --abort-on-container-exit --exit-code-from tests
```

El resultado esperado es `9 passing`. Para limpiar los recursos temporales:

```bash
docker compose down --remove-orphans
```

### Ejecución local (opcional)

Con Node.js 22 y npm instalados:

```bash
npm ci
npm test
```

La base de datos de las pruebas es SQLite en memoria, por lo que no requiere instalación ni configuración adicional.

### Qué prueban los tests

- Unitario: verifica la regla aislada que determina si hay cupos.
- Bottom-Up: conecta repositorios con SQLite.
- Top-Down: recorre HTTP, ruta, controlador, servicio, repositorios y SQLite.
- Sandwich: combina una solicitud HTTP con la verificación directa de los datos persistidos.
- Big Bang: reserva el único cupo disponible y comprueba que una segunda reserva falla.

### Demo de fallo controlado

```bash
docker compose run --rm -e DEMO_BUG_MODE=skip-seat-update tests npm run test:demo-bug
```

Este comando debe fallar: simula que la reserva se guarda sin descontar el cupo.