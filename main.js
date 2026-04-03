import { Animator } from "./core/animator.js";
import { getAlgorithm } from "./core/state.js";
import { Renderer } from "./ui/renderer.js";
import { setOriginalMatrix } from "./algorithms/hungarian.js";

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



// --- Custom Matrix Modal Logic (Hungarian only) ---
const matrixModal = document.getElementById("matrixModal");
const customMatrixBtn = document.getElementById("customMatrixBtn");
const cancelMatrixBtn = document.getElementById("cancelMatrixBtn");
const submitMatrixBtn = document.getElementById("submitMatrixBtn");
const matrixInput = document.getElementById("matrixInput");
const matrixError = document.getElementById("matrixError");

function setCustomMatrixButtonVisibility() {
    if (algorithmSelect.value === "hungarian") {
        customMatrixBtn.style.display = "inline-block";
    } else {
        customMatrixBtn.style.display = "none";
        matrixModal.style.display = "none";
    }
}

algorithmSelect.addEventListener("change", setCustomMatrixButtonVisibility);
setCustomMatrixButtonVisibility();

customMatrixBtn.onclick = () => {
    matrixModal.style.display = "flex";
    matrixInput.value = "";
    matrixError.textContent = "";
};

cancelMatrixBtn.onclick = () => {
    matrixModal.style.display = "none";
};

submitMatrixBtn.onclick = () => {
    // Parse and validate matrix input
    const rows = matrixInput.value.trim().split(/\n+/);
    const matrix = rows.map(row => row.trim().split(/[,\s]+/).map(Number));
    const size = matrix.length;
    const valid = matrix.every(row => row.length === size && row.every(Number.isFinite));
    if (!valid) {
        matrixError.textContent = "Please enter a valid square matrix of numbers.";
        return;
    }
    matrixModal.style.display = "none";
    // Update the static matrix for Hungarian and redraw
    setOriginalMatrix(matrix);
    if (algorithmSelect.value === "hungarian") {
        renderer.draw(getAlgorithm("hungarian").getInitialState());
    }
};

loadAlgorithm(algorithmSelect.value);
