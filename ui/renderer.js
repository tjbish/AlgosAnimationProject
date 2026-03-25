export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.currentAlgorithm = null;
    }

    setAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(state) {
        this.clear();

        if (!this.currentAlgorithm || typeof this.currentAlgorithm.draw !== "function") {
            return;
        }

        this.currentAlgorithm.draw({
            ctx: this.ctx,
            canvas: this.canvas,
            state,
        });
    }
}
