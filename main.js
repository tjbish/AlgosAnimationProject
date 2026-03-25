import { Animator } from "./core/animator.js";
import { getAlgorithm } from "./core/state.js";
import { Renderer } from "./ui/renderer.js";

const canvas = document.getElementById("canvas");
const algorithmSelect = document.getElementById("algorithmSelect");
const renderer = new Renderer(canvas);

let currentAlgorithm = null;

const animator = new Animator((state) => {
    renderer.draw(state);
});

function loadAlgorithm(algorithmKey) {
    currentAlgorithm = getAlgorithm(algorithmKey);
    renderer.setAlgorithm(currentAlgorithm);
    animator.setGeneratorFactory(() => currentAlgorithm.createGenerator());
    renderer.draw(currentAlgorithm.getInitialState());
}

algorithmSelect.onchange = (event) => {
    loadAlgorithm(event.target.value);
};

document.getElementById("playBtn").onclick = () => {
    animator.play();
};

document.getElementById("pauseBtn").onclick = () => {
    animator.pause();
};

document.getElementById("stepBtn").onclick = () => {
    animator.step();
};

document.getElementById("resetBtn").onclick = () => {
    animator.reset();
    renderer.draw(currentAlgorithm.getInitialState());
};

loadAlgorithm(algorithmSelect.value);
