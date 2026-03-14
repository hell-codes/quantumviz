# ⚛️ QuantumViz — Quantum Mechanics Visualization Platform

> An interactive web platform that brings quantum mechanics to life through real-time simulations, animations, and visual explainers — built with pure HTML, CSS, and JavaScript.

---

## 🌐 Live Demo

> Open `index.html` in any modern browser — no server, no build step, no dependencies (except the Wave Packet 3D view which loads Three.js from CDN).

---

## 📸 Pages Overview

| Page | What it demonstrates |
|---|---|
| **Home** | Wave–particle duality · Atomic orbital model |
| **Harmonic Oscillator** | Wavefunctions ψ(x) · Probability density · Energy levels |
| **Energy Levels** | Photon absorption & emission · Quantized transitions · Spectrum |
| **Wave Packet** | Quantum dispersion · Heisenberg uncertainty · Momentum space |
| **Schrödinger's Cat** | Superposition · Wavefunction collapse · Quantum statistics |
| **Applications** | Ion traps · Molecular vibrations · Quantum optics cavity |

---

## ✨ Features

### Physics Simulations
- **Quantum Harmonic Oscillator** — wavefunctions for n = 0–5, colour-coded per quantum number, filled probability density, classical turning points, live Eₙ = ℏω(n + ½) readout
- **Energy Level Transitions** — electron jumps between quantized levels, colour-coded photon emission/absorption, live spectrum strip
- **Wave Packet Evolution** — true quantum dispersion (σ grows with time), momentum-space view |ψ̃(k)|², real-time Δx · Δp ≥ ℏ/2 readout
- **Schrödinger's Cat** — superposition shimmer animation, configurable decay probability slider, outcome statistics counter across repeated experiments
- **Applications** — quantized ion trap levels, molecular IR spectrum pulse, optical cavity Fock state |n⟩ with photon injection

### UI & UX
- Animated starfield background on every page
- Active navigation link highlighting
- Responsive hamburger menu for mobile
- Smooth page fade-in transitions
- Formula hover tooltips with symbol-by-symbol breakdowns
- Live readout bars (quantum number, energy, uncertainty product)
- Play / Pause control on the oscillator
- Navigation card grid on the home page

---

## 🗂️ Project Structure

```
QuantumViz/
│
├── index.html              # Home — wave-particle duality + atom model
├── oscillator.html         # Quantum harmonic oscillator
├── energy.html             # Energy level transitions
├── wavepacket.html         # Wave packet evolution
├── schrodinger.html        # Schrödinger's cat thought experiment
├── applications.html       # Real-world quantum oscillator applications
│
├── css/
│   └── index.css           # All styles — layout, navbar, panels, animations
│
└── js/
    ├── nav.js              # Active link highlight + hamburger menu (shared)
    ├── background.js       # Starfield background animation (shared)
    ├── homeAnimations.js   # Home page — wave + atom model
    ├── oscillator.js       # Wavefunction, probability density, energy diagram
    ├── potential.js        # Energy level transitions + photon animation
    ├── wavepacket.js       # Wave packet + momentum space + dispersion
    ├── wavepacket3d.js     # Three.js 3D probability cloud
    ├── schrodinger.js      # Cat experiment + superposition + statistics
    └── applications.js     # Ion trap, molecule, optical cavity
```

---

## 🚀 Getting Started

### Run locally

```bash
# Clone the repository
git clone https://github.com/hell-codes/quantumviz.git

# Navigate into the folder
cd quantumviz

# Open in browser (no build step needed)
open index.html
```

Or simply download the ZIP and open `index.html` directly in Chrome, Firefox, or Edge.

### Requirements

- Any modern browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Internet connection only required for the 3D wave packet view (loads `three.js` from CDN)
- No Node.js, no npm, no build tools

---

## 🧪 Physics Concepts Covered

| Concept | Where |
|---|---|
| Wavefunction ψ(x) and probability density \|ψ\|² | Oscillator, Wave Packet |
| Quantized energy levels Eₙ = ℏω(n + ½) | Oscillator, Energy Levels |
| Photon emission and absorption | Energy Levels |
| Heisenberg uncertainty principle Δx · Δp ≥ ℏ/2 | Wave Packet |
| Quantum dispersion | Wave Packet |
| Superposition and wavefunction collapse | Schrödinger's Cat |
| Quantum harmonic oscillator applications | Applications |
| Fock states \|n⟩ in quantum optics | Applications |

---

## 🛠️ Built With

- **HTML5 Canvas** — all physics animations rendered in real time
- **Vanilla JavaScript** — zero frameworks, zero build tools
- **CSS3** — animations, transitions, responsive layout
- **Three.js** (CDN) — 3D probability cloud on the Wave Packet page only

---

## 📁 GitHub Repository Details

**Repository name:**
```
quantumviz
```

**Description:**
```
⚛️ Interactive quantum mechanics visualizer — wavefunctions, energy levels, wave packets, Schrödinger's cat and more. Built with pure HTML, CSS and JavaScript.
```

**Topics / Tags to add on GitHub:**
```
quantum-mechanics  physics  simulation  visualization  html5-canvas
javascript  education  wavefunction  quantum-computing  interactive
```

---

## 📄 License

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

## 🙌 Acknowledgements

- Physics formulations based on standard quantum mechanics curricula
- [Three.js](https://threejs.org/) for 3D point cloud rendering
- Inspired by the need to make quantum mechanics visually intuitive for students

---

*Made with curiosity about the quantum world.*
