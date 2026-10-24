# 2026-10-24 · fase: saturación del dominio rápido

Imagen: `img/2026-10-24_saturacion.png` (captura de la gráfica «Frame period per occupancy stratum», evidence/#saturation).
Enlace: https://naype888-cloud.github.io/bacqm-systems/evidence/#saturation

## ES

La frontera no es un muro.

Llevamos el dominio rápido de memoria a 0.998 de su cota bajo una carga gráfica en tiempo real: 425 860 cuadros, siete corridas.
La mediana del período de cuadro no se mueve (1.01–1.04 T₀ en todos los estratos de ocupación) y la cola p99 se mantiene finita: 3.55 T₀ en el estrato s ≥ 0.98, más ligera que la del estrato inferior.
El procesador anfitrión se queda en 0.20 de carga mientras el acelerador trabaja a ≥ 90 %.
El libro del operador de transporte cierra al byte: lo pedido es lo completado más lo rechazado, y el residuo neto es exactamente el conjunto rechazado.

La ley no lleva ninguna prescripción de tamaño; por el teorema Π es función de grupos adimensionales y vale igual en una placa que en una flota.

Nota formal §4–§6 y datos abiertos: https://naype888-cloud.github.io/bacqm-systems/

## EN

The boundary is not a wall.

We drove the fast memory domain to 0.998 of its bound under a real-time graphics workload: 425,860 frames, seven runs.
The median frame period does not move (1.01–1.04 T₀ in every occupancy stratum) and the p99 stays finite: 3.55 T₀ at s ≥ 0.98, lighter than the stratum beneath it.
The host processor holds 0.20 load while the accelerator runs at ≥ 90 % duty.
The transport ledger closes to the byte: requested equals completed plus rejected, and the net residual is exactly the rejected set.

The law carries no prescription of size; by the Π-theorem it is a function of dimensionless groups and holds the same on a single board and on a fleet.

Formal note §4–§6 and open data: https://naype888-cloud.github.io/bacqm-systems/
