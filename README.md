<a href="https://naype888-cloud.github.io/bacqm-systems/"><img src="docs/media/banner.svg" alt="BACQM Systems — memory as a flow, not a volume. Open the site" width="100%"></a>

**[▶ naype888-cloud.github.io/bacqm-systems](https://naype888-cloud.github.io/bacqm-systems/)**

`𝒱`: the fast transit domain. `ℛ = ⊕ ℛᵢ`: the elastic domain split into `k` collectors of equal precedence, served in turn. `𝒯 : 𝒱 ⇄ ℛ`: the transport operator, with an exactly closed ledger. `Ω`: the kernel control law, without prescriptions of size, hence a function of dimensionless groups alone (Π-theorem). `∇S`: dissipation as a term of the balance. The algebra names no size; it is the same on a single board and on a fleet.

| | Statement | Basis | Status |
|---|---|---|---|
| equal-precedence direct sum | `ℛ = ⊕ ℛᵢ`, `π(ℛᵢ) = π(ℛⱼ)`, page `n` → `ℛ_(n mod k)` | `k = 2` compressed lanes, interleaved | deployed |
| tail bound / scale invariance | `t₀.₉₉·μ = ln 100 / (1 − ρ/k)`; depends on `ρ/k` only | exponential absorption; exact at `k = 1`, upper bound for `k ≥ 2` | model · [▶ Try it](https://naype888-cloud.github.io/bacqm-systems/formal/#tryit) |
| one more lane | `ρ ≥ k` ⇒ unbounded backlog; `k* = ⌊ρ⌋ + 1` | Corollary 2 | model |
| tail latency / declared trade-off | p99 · p999 · max **−90 % to −99 %**; p50 +10.5 % to +13.8 % | 8+ A/B campaigns against the unmodified baseline, `n ≥ 3` | measured |
| Π-reduction / dilation equivariance | `Φ(σ/C_𝒱, ℓᵢ/C_ℛ, ρ/k, P) = 0`; invariant under `(C, σ, ℓ) ↦ c·(C, σ, ℓ)` | Buckingham Π-theorem; no size prescription in the deployed law | model |
| fast-domain boundary | `‖σ‖ / C_𝒱 ≥ 0.9975`, no panic, no controller reset | sustained saturation | measured |
| saturation without divergence | stratum `s ≥ 0.98`: `q50 = 1.01 T₀`, `q99 = 3.55 T₀`; median 1.01–1.04 `T₀` in every stratum | 425,860 frames, 7 runs · [`saturation_strata.csv`](data/saturation_strata.csv) · [▶ chart](https://naype888-cloud.github.io/bacqm-systems/evidence/#saturation) | measured |
| asymmetric decoupling | `𝔼[load_host \| duty ≥ 0.9] = 0.20` | 42,387 frames at accelerator duty ≥ 0.9 | measured |
| exact ledger | `R = N + F` to the byte; `Δ = N↓ − N↑ = F↑ = 4` of 1,260 requests | Proposition 3 · cumulative kernel counters | measured |
| non-invasive observation | 2,582 passive samples, 15 Aug – 14 Oct 2026; no auxiliary wakeups | [`data/passive_weekly_medians.csv`](data/passive_weekly_medians.csv) | measured |
| uncertainty relation on transport : position | NRS, NRS³, det\|NRS³\| | Physlib [#1723](https://github.com/leanprover-community/physlib/pull/1723), [#1725](https://github.com/leanprover-community/physlib/pull/1725) · [BACQM-NRS³](https://naype888-cloud.github.io/BACQM-NRS3/) | Lean 4 |

Site: [formal note](https://naype888-cloud.github.io/bacqm-systems/formal/) · [evidence](https://naype888-cloud.github.io/bacqm-systems/evidence/) · Mathematics: [nava-robertson-schrodinger](https://github.com/naype888-cloud/nava-robertson-schrodinger) · [BACQM-NRS³](https://github.com/naype888-cloud/BACQM-NRS3) · [45 merged Physlib pull requests](https://github.com/leanprover-community/physlib/pulls?q=is%3Apr+is%3Amerged+author%3Anaype888-cloud)

Kernel source is private; methodology, data and the mathematics are open. For a pilot, open an [issue](https://github.com/naype888-cloud/bacqm-systems/issues). Campaign texts live in [`campaign/`](campaign/).

**Data.** [`data/`](data/) holds every series the site draws, already reduced to ratios (occupancy `s = σ/C_𝒱`, loads, frame period in units of the presentation period `T₀`): no device, vendor or size appears. `docs/data/` is the copy the site reads.
