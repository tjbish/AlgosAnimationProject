import { Animator } from "./core/animator.js";
import { Renderer } from "./ui/renderer.js";

// TEMP dummy generator
function* dummyAlgorithm() {
    let i = 0;
    while (i < 10) {
        yield { step: i++ };
    }
}

const canvas = document.getElementById("canvas");
const renderer = new Renderer(canvas);

const animator = new Animator((state) => {
    renderer.draw(state);
});

document.getElementById("playBtn").onclick = () => {
    animator.setGenerator(dummyAlgorithm());
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
    renderer.draw({});
};
