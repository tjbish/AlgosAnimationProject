# AlgosAnimationProject

Repository for the University of Alabama CS 470 Algorithm Animations Project, Spring 2026.

## Overview

This project is a browser-based visualization tool for algorithm animations. The interface provides a canvas for rendering algorithm states and a small control panel for selecting an algorithm, playing the animation, pausing it, stepping through frames, and resetting the view.

The current implementation is intentionally modular:

- The `Animator` controls playback timing and frame advancement;
- The `Renderer` manages the canvas and delegates drawing to the selected algorithm;
- Each algorithm module provides its own initial state, animation frames, and drawing logic

This structure is intended to make it easier to replace or expand algorithm implementations over time without rewriting the rest of the application.

## Project Structure

- `index.html`  
  Main page for the visualization app. Defines the algorithm dropdown, playback controls, and canvas element.

- `style.css`  
  Basic page styling, including the gray page background and white canvas drawing area.

- `main.js`  
  Application entry point. Connects the DOM controls to the animator, renderer, and selected algorithm module.

- `core/animator.js`  
  Playback engine responsible for stepping through generator-produced animation frames at a fixed interval.

- `core/state.js`  
  Algorithm registry. Imports available algorithm modules and maps dropdown values to the correct implementation.

- `ui/renderer.js`  
  Canvas renderer. Clears the drawing area and calls the active algorithm's `draw(...)` function with the current state.

- `ui/controls.js`  
  Reserved for future control-related logic.

- `algorithms/gale_shapley.js`  
  JavaScript code used to perform Gale-Shapley algorithm rendering and step generation for stable matching visualization.

- `algorithms/hungarian.js`  
  JavaScript code used to perform Hungarian algorithm rendering and step generation for assignment or cost-matrix visualization.

- `algorithms/dinic.js`  
  JavaScript code used to perform Dinic algorithm rendering and step generation for network flow visualization.

## How It Works

When the page loads, `main.js` reads the currently selected algorithm and loads it through `core/state.js`. The selected algorithm object is expected to provide three functions:

- `getInitialState()` returns the state that should be shown before animation begins
- `createGenerator()` returns a generator that yields one animation state at a time
- `draw({ ctx, canvas, state })` renders the current state onto the canvas

The workflow is:

1. The user selects an algorithm
2. `main.js` loads that algorithm and passes it to the renderer
3. `Animator` advances through the generator one frame at a time
4. `Renderer` clears the canvas and asks the algorithm to draw the current frame

## Running the Project

This project is written as a client-side JavaScript application and is intended to be hosted through a web server, such as GitHub Pages.

For deployment:

- push the repository to GitHub
- enable GitHub Pages for the repository
- open the published Pages URL in a browser

Because the app uses JavaScript modules, opening `index.html` directly from disk with `file://` may not behave the same as serving it through GitHub Pages.

## Controls

- `Play` starts automatic animation playback
- `Pause` stops automatic playback
- `Step` advances the animation by one state
- `Reset` returns the current algorithm to its initial state

## Adding or Replacing an Algorithm

To add a new algorithm module:

1. create a new file in `algorithms/`
2. export an algorithm object with:
   - `name`
   - `getInitialState()`
   - `createGenerator()`
   - `draw({ ctx, canvas, state })`
3. import the new module into `core/state.js`
4. register it in the `algorithms` object
5. add a matching `<option>` to the dropdown in `index.html`

This keeps the playback system and rendering pipeline unchanged while allowing algorithm-specific logic to evolve independently.

## Notes

- The current algorithm implementations are placeholders and may be revised significantly.
- The README descriptions for individual algorithms are intentionally short so they can remain accurate while the implementations change.

## Contributors

Current names listed in the page:

- Tyler Bish
- Jackson Wallace
- Kian McKenna
- Peter Capriotti
- Ryan Montgomery
- Brayden Rouse
- Aiden Slabiak

Update the contributor list in both `README.md` and `index.html` as the project roster is finalized.
