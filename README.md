# AlgosAnimationProject

Repository for the University of Alabama CS 470 Algorithm Animations Project, Spring 2026.

## Overview

This project is a browser-based visualization tool for stepping through three algorithms on an HTML canvas:

- Gale-Shapley stable matching
- Hungarian assignment
- Dinic maximum flow

The application is modular:

- `Animator` controls playback timing and frame advancement
- `Renderer` clears the canvas and delegates drawing to the selected algorithm
- Each algorithm module owns its own initial state, animation generator, and rendering logic

This structure allows new visualizations to be added without changing the playback system.

## Current Features

- Algorithm selection from a shared dropdown
- Play, pause, step, and reset controls for all algorithms
- Gale-Shapley stable matching animation with dynamic node counts
- Hungarian algorithm animation with custom matrix input
- Dinic algorithm animation with random network generation

## Algorithm-Specific Functionality

### Gale-Shapley

- Visualizes proposals, tentative matches, rejections, and final stable matching
- Supports variable problem sizes through the `Nodes` slider
- Generates different preference scenarios for each reset
- Draws proposers, receivers, active proposals, accepted matches, and proposer preference tables

### Hungarian

- Visualizes row reduction, column reduction, zero coverage, matrix adjustment, and final assignment
- Includes a `Custom Matrix` modal for user-provided square cost matrices
- Shows the original matrix beside the working matrix during animation

### Dinic

- Visualizes level graph construction and blocking-flow augmentation
- Supports randomized flow networks with the `Randomize` button
- Displays node levels, active augmenting paths, and per-edge flow/capacity values

## Project Structure

- `index.html`
  Main page for the visualization app. Defines the controls, modal, and canvas.

- `style.css`
  Global page styling.

- `main.js`
  Application entry point. Wires the DOM controls to the animator, renderer, and selected algorithm.

- `core/animator.js`
  Playback engine that consumes generator output one state at a time.

- `core/state.js`
  Algorithm registry. Imports each algorithm module and maps dropdown values to implementations.

- `ui/renderer.js`
  Canvas renderer. Clears the canvas and invokes the active algorithm's `draw(...)` function.

- `algorithms/gale_shapley.js`
  Gale-Shapley stable matching visualization, scenario generation, and dynamic node controls.

- `algorithms/hungarian.js`
  Hungarian algorithm visualization, matrix operations, and custom matrix support.

- `algorithms/dinic.js`
  Dinic maximum flow visualization, level graph generation, and randomized network support.

## How It Works

When the page loads, `main.js` reads the selected algorithm and loads it through `core/state.js`. Each algorithm object provides:

- `getInitialState()` to define the first frame
- `createGenerator()` to yield animation states step by step
- `draw({ ctx, canvas, state })` to render the current frame

The workflow is:

1. The user selects an algorithm.
2. `main.js` retrieves that implementation from `core/state.js`.
3. `Renderer` draws the initial state on the canvas.
4. `Animator` advances through the algorithm generator during play or step actions.
5. The selected algorithm redraws each new state.

## Running the Project

Because the app uses ES modules, it should be served through a local or hosted web server rather than opened directly with `file://`.

### Run Locally

From the project root, start a simple HTTP server. For example:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

### Deploy

The project is also hosted with GitHub Pages within this repository and can be deployed to any static web server of your choice.

## Controls

- `Play` starts automatic playback
- `Pause` stops automatic playback
- `Step` advances one frame
- `Reset` rebuilds the current algorithm's initial state
- `Custom Matrix` appears only for Hungarian
- `Randomize` appears only for Dinic
- `Nodes` slider appears only for Gale-Shapley

## Adding a New Algorithm

To add a new visualization:

1. Create a new file in `algorithms/`.
2. Export an algorithm object with `name`, `getInitialState()`, `createGenerator()`, and `draw({ ctx, canvas, state })`.
3. Import and register it in `core/state.js`.
4. Add a matching `<option>` in `index.html`.
5. Add any algorithm-specific controls in `main.js` if needed.

## Contributors

- Tyler Bish
- Jackson Wallace
- Kian McKenna
- Peter Capriotti
- Ryan Montgomery
- Brayden Rouse
- Aiden Slabiak
- Nathan Hubbell
- Lee Garber-Ford
