<a href="https://naype888-cloud.github.io/bacqm-systems/"><img src="docs/media/banner.svg" alt="BACQM Systems — memory as a flow, not a volume. Open the site" width="100%"></a>

**[▶ naype888-cloud.github.io/bacqm-systems](https://naype888-cloud.github.io/bacqm-systems/)**

`𝒱`: the fast transit domain. `ℛ = ⊕ᵢ₌₁⁷ ℛᵢ`: the elastic domain split into `k = 7` concurrent collectors of equal precedence, served in cyclic turn (`ℤ₇` symmetry). `𝒯 : 𝒱 ⇄ ℛ`: the transport operator, with an exactly closed ledger. `Ω`: the homeostatic kernel control law, without prescriptions of size, governed by the non-commutative Robertson–Schrödinger uncertainty bound (`dN_Q ≥ 0.364`) and continuous `ℚ₁₂` projections onto the memory-virtual management manifold. `∇S`: dissipation as a term of the balance. The algebra names no size; it is the same on a single board and on a fleet.

| | Statement | Basis | Status |
|---|---|---|---|
| equal-precedence direct sum | `ℛ = ⊕ᵢ₌₁⁷ ℛᵢ`, `π(ℛᵢ) = π(ℛⱼ)`, page `n` → `ℛ_(n mod 7)` | `k = 7` concurrent compressed collectors (`ℤ₇` symmetry), 2.88:1 ratio | deployed |
| tail bound / scale invariance | `t₀.₉₉·μ = ln 100 / (1 − ρ/k)`; depends on `ρ/k` only | exponential absorption; exact at `k = 1`, upper bound for `k ≥ 2` | model · [▶ Try it](https://naype888-cloud.github.io/bacqm-systems/formal/#tryit) |
| one more lane | `ρ ≥ k` ⇒ unbounded backlog; `k* = ⌊ρ⌋ + 1` | Corollary 2 | model |
| tail latency / declared trade-off | p99 · p999 · max **−90 % to −99 %**; p50 +10.5 % to +13.8 % | 8+ A/B campaigns against the unmodified baseline, `n ≥ 3` | measured |
| Π-reduction / dilation equivariance | `Φ(σ/C_𝒱, ℓᵢ/C_ℛ, ρ/k, P) = 0`; invariant under `(C, σ, ℓ) ↦ c·(C, σ, ℓ)` | Buckingham Π-theorem; no size prescription in the deployed law | model |
| continuous ℚ₁₂ fixed-point actuation | `Π_VM = (s_w, d_r, r_a, n_rq, τ_thp) ∈ ℝ>0⁵`; no integer prescriptions | Buckingham Π-theorem; continuous projection on the VM manifold | deployed |
| fast-domain boundary | `‖σ‖ / C_𝒱 ≥ 0.9975`, no panic, no controller reset | sustained saturation | measured |
| saturation without divergence | stratum `s ≥ 0.98`: `q50 = 1.01 T₀`, `q99 = 3.55 T₀`; median 1.01–1.04 `T₀` in every stratum | 425,860 frames, 7 runs · [`saturation_strata.csv`](data/saturation_strata.csv) · [▶ chart](https://naype888-cloud.github.io/bacqm-systems/evidence/#saturation) | measured |
| asymptotic symbolic saturation | `p50 ∈ [1, 12] µs` at load 9.25; outward evacuation `p_swpout → 0` for >30 min; PSI stall −99.998 %; `kills = 0` | 65-min continuous formal proof resolution (>20 % RAM resident) · [▶ Evidence E5](https://naype888-cloud.github.io/bacqm-systems/evidence/#extreme) | measured |
| asymmetric decoupling | `𝔼[load_host \| duty ≥ 0.9] = 0.20` | 42,387 frames at accelerator duty ≥ 0.9 | measured |
| exact ledger | `R = N + F` to the byte; `Δ = N↓ − N↑ = F↑ = 4` of 1,260 requests | Proposition 3 · cumulative kernel counters | measured |
| non-invasive observation | 2,582 passive samples, 15 Aug – 14 Oct 2026; no auxiliary wakeups | [`data/passive_weekly_medians.csv`](data/passive_weekly_medians.csv) | measured |
| uncertainty relation on transport : position | NRS, NRS³, det\|NRS³\| | Physlib [#1723](https://github.com/leanprover-community/physlib/pull/1723), [#1725](https://github.com/leanprover-community/physlib/pull/1725) · [BACQM-NRS³](https://naype888-cloud.github.io/BACQM-NRS3/) | Lean 4 |

---

### Non-Commutative Uncertainty

The control dynamics are bounded below by the non-commutative uncertainty relation on the state observables; the bound is certified at every tick. The control law itself is not published here.

---

### Sustained Extreme-Entropy Saturation (Evidence E5)

Under an unconstrained symbolic proof-resolution workload executing continuous recursive dependency search for >60 minutes, driving active resident memory beyond 20 % of host capacity (>6.5 GiB in a single task tree) under peak compute load (load average reaching 9.25):

* **Microsecond Scheduling Median:** Run-queue dispatch latency median was held strictly between 1 µs and 12 µs ($p_{50} \in [1, 12]\,\mu\text{s}$, $p_{99} \le 6.1\,\text{ms}$) under maximum saturation, mediated by non-preemptive work-stealing backed by the nava operator manifold.
* **Asymptotic Collapse of Outbound Flux:** Following an initial entropic evacuation surge ($1.24 \times 10^5$ pages/min) into the $k = 7$ equal-precedence collector array, outward page evacuation dropped strictly to $p_{\text{swpout}} = 0$ for over 30 consecutive minutes. Memory pressure stall duration collapsed from 1,069 ms to 0.02 ms ($-99.998\,\%$) with zero swap-thrashing stall.
* **Invariant Memory Guard:** Zero out-of-memory terminations and zero process liquidations ($\text{kills} = 0$, $\text{danger} = 0$), with an empirical prediction accuracy of 99.15 % over 5.4 million cycles.

#### Collector Bundle Partition ($k = 7$)
The offered volatile entropy is partitioned across 7 concurrent collectors under cyclic symmetry $\mathbb{Z}_7$ at priority 100:

| Collector | Bound | Raw Volume | Compressed Footprint | Compression Ratio | Precedence |
|---|---|---|---|---|---|
| $\mathcal{R}_0$ | 4.0 GiB | 194.8 MiB | 72.2 MiB | 2.70 : 1 | 100 |
| $\mathcal{R}_1$ | 4.0 GiB | 192.0 MiB | 54.0 MiB | 3.55 : 1 | 100 |
| $\mathcal{R}_2$ | 4.0 GiB | 183.7 MiB | 52.8 MiB | 3.48 : 1 | 100 |
| $\mathcal{R}_3$ | 4.0 GiB | 179.7 MiB | 68.3 MiB | 2.63 : 1 | 100 |
| $\mathcal{R}_4$ | 4.0 GiB | 190.0 MiB | 69.7 MiB | 2.72 : 1 | 100 |
| $\mathcal{R}_5$ | 4.0 GiB | 192.4 MiB | 70.7 MiB | 2.72 : 1 | 100 |
| $\mathcal{R}_6$ | 4.0 GiB | 194.1 MiB | 73.0 MiB | 2.66 : 1 | 100 |
| **Aggregate** | **28.0 GiB** | **1,326.7 MiB** | **460.7 MiB** | **2.88 : 1** | — |

---

Site: [formal note](https://naype888-cloud.github.io/bacqm-systems/formal/) · [evidence](https://naype888-cloud.github.io/bacqm-systems/evidence/) · Mathematics: [nava-robertson-schrodinger](https://github.com/naype888-cloud/nava-robertson-schrodinger) · [BACQM-NRS³](https://github.com/naype888-cloud/BACQM-NRS3) · [45 merged Physlib pull requests](https://github.com/leanprover-community/physlib/pulls?q=is%3Apr+is%3Amerged+author%3Anaype888-cloud)

Kernel source is private; methodology, data and the mathematics are open. For a pilot, open an [issue](https://github.com/naype888-cloud/bacqm-systems/issues). Campaign texts live in [`campaign/`](campaign/).

**Data.** [`data/`](data/) holds every series the site draws, already reduced to ratios (occupancy `s = σ/C_𝒱`, loads, frame period in units of the presentation period `T₀`): no device, vendor or size appears. `docs/data/` is the copy the site reads.
