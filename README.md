# BACQM Systems — Data Center Optimization

**Linux kernel modules and a `sched_ext` scheduler that cut tail latency (p99, p999, max) at the cost of a slightly higher p50.**

Módulos de kernel Linux y un scheduler `sched_ext` que bajan la latencia de cola
(p99, p999, máx.) a cambio de un p50 un poco más alto. La mejora sale de la
arquitectura del scheduler, no de un ajuste fino.

## Resultados medidos

Todas las mediciones son de nuestro banco de pruebas: una sola máquina Fedora 44,
kernel 7.0.12, AMD Ryzen 5 4600H (12 hilos), 30 GiB de RAM y una GPU GeForce GTX 1650.
Todavía no hay mediciones en un data center.

### Campañas A/B contra CONTROL (agosto de 2026)

CONTROL es Fedora sin modificar (scheduler EEVDF). Cada campaña alterna
CONTROL y BACQM, con n ≥ 3 repeticiones, y reporta la mediana.

| Métrica | BACQM contra CONTROL | Base |
| --- | --- | --- |
| p99, p999 y máx. | −90 % a −99 % | 8+ campañas A/B, n ≥ 3 cada una |
| p50 | +10.5 % a +13.8 % | mismas campañas |

Dos campañas del 14–15 de agosto no cuentan (`valid=false`): la temperatura
varió más de 5 °C entre corridas.

### Telemetría pasiva (15 ago – 14 oct 2026)

Cada 30 minutos, con el sistema en uso normal y sin carga sintética, una sonda de
5 s mide el retraso al despertar de un hilo periódico de 1 ms. Hay 2,582 muestras
con el scheduler activo. Las medianas semanales están en
[`data/passive_weekly_medians.csv`](data/passive_weekly_medians.csv).

| Periodo | Muestras | p50 | p99 | p999 | máx. | Ciclos perdidos |
| --- | --- | --- | --- | --- | --- | --- |
| 15 ago – 26 sep | 1,791 | 83.3 µs | 119.8 µs | 317.0 µs | 513.9 µs | 0.080 % |
| 27 sep – 14 oct | 791 | 87.3 µs | 259.9 µs | 415.0 µs | 559.6 µs | 0.013 % |

El cambio entre los dos periodos coincide con la actualización de los módulos
instalada el 26 de septiembre: el p99 pasivo subió de 120 a 260 µs y los ciclos
perdidos bajaron de 0.080 % a 0.013 %. La telemetría pasiva no tiene grupo de
control; la comparación contra CONTROL se repetirá con los módulos actuales.

## Plataformas

| Plataforma | Estado |
| --- | --- |
| x86-64, Fedora 44, kernel 7.0 | En uso diario; todas las mediciones de arriba |
| ARM64, Android GKI 6.1 (Pixel 6 Pro) | Módulos cargados y verificados el 21 sep 2026; sin mediciones de latencia aún |

El sistema vive sobre Linux, así que corre donde corre Linux. Un data center
agrega muchos nodos, NUMA y GPU; ese paso se mide en un piloto, no se supone.

## La matemática, verificada en Lean 4

El diseño parte de la relación de incertidumbre de Robertson–Schrödinger sobre el
par transporte–posición. La matemática está verificada en Lean 4:

- [nava-robertson-schrodinger](https://github.com/naype888-cloud/nava-robertson-schrodinger): NRS, NRS³ y det|NRS³|.
- 32 pull requests fusionados en [Physlib](https://github.com/leanprover-community/physlib/pulls?q=is%3Apr+is%3Amerged+author%3Anaype888-cloud),
  la biblioteca de física en Lean de la comunidad.

Lean verifica la matemática; el p99 lo verifican las mediciones de arriba.

## Código

El código del kernel es privado. Este repo publica resultados, metodología y la
matemática. Para un piloto en tu data center, abre un issue en este repo.

## Campaña

Los textos de cada publicación en redes viven en [`campaign/`](campaign/).
