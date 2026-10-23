<a href="https://naype888-cloud.github.io/bacqm-systems/"><img src="docs/media/banner.svg" alt="BACQM Systems — memory as a flow, not a volume. Open the site" width="100%"></a>

**[▶ naype888-cloud.github.io/bacqm-systems](https://naype888-cloud.github.io/bacqm-systems/)**

`𝒱`: the fast transit domain. `ℛ = ⊕ ℛᵢ`: the elastic domain split into `k` collectors of equal precedence, served in turn. `Ω`: the kernel control law, no fixed constants. `∇S`: dissipation as a term of the balance. The algebra names no size; it is the same on a single board and on a fleet.

| | Statement | Basis | Status |
|---|---|---|---|
| equal-precedence direct sum | `ℛ = ⊕ ℛᵢ`, `π(ℛᵢ) = π(ℛⱼ)`, page `n` → `ℛ_(n mod k)` | `k = 2` compressed lanes, interleaved | deployed |
| tail bound / scale invariance | `t₀.₉₉·μ = ln 100 / (1 − ρ/k)`; depends on `ρ/k` only | exponential absorption; exact at `k = 1`, upper bound for `k ≥ 2` | model · [▶ Try it](https://naype888-cloud.github.io/bacqm-systems/formal/#tryit) |
| one more lane | `ρ ≥ k` ⇒ unbounded backlog; `k* = ⌊ρ⌋ + 1` | Corollary 2 | model |
| tail latency / declared trade-off | p99 · p999 · max **−90 % to −99 %**; p50 +10.5 % to +13.8 % | 8+ A/B campaigns against the unmodified baseline, `n ≥ 3` | measured |
| fast-domain boundary | `‖σ‖ / C_𝒱 ≥ 0.9975`, no panic, no controller reset | sustained saturation | measured |
| asymmetric decoupling | `𝔼[load_host] ≈ 0.19–0.21` with the accelerator at 96–100 % duty | continuous instrumentation | measured |
| non-invasive observation | 2,582 passive samples, 15 Aug – 14 Oct 2026; no auxiliary wakeups | [`data/passive_weekly_medians.csv`](data/passive_weekly_medians.csv) | measured |
| uncertainty relation on transport : position | NRS, NRS³, det\|NRS³\| | Physlib [#1723](https://github.com/leanprover-community/physlib/pull/1723), [#1725](https://github.com/leanprover-community/physlib/pull/1725) · [BACQM-NRS³](https://naype888-cloud.github.io/BACQM-NRS3/) | Lean 4 |

Site: [formal note](https://naype888-cloud.github.io/bacqm-systems/formal/) · [evidence](https://naype888-cloud.github.io/bacqm-systems/evidence/) · Mathematics: [nava-robertson-schrodinger](https://github.com/naype888-cloud/nava-robertson-schrodinger) · [BACQM-NRS³](https://github.com/naype888-cloud/BACQM-NRS3) · [45 merged Physlib pull requests](https://github.com/leanprover-community/physlib/pulls?q=is%3Apr+is%3Amerged+author%3Anaype888-cloud)

Kernel source is private; methodology, data and the mathematics are open. For a pilot, open an [issue](https://github.com/naype888-cloud/bacqm-systems/issues). Campaign texts live in [`campaign/`](campaign/).
