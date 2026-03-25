export class Renderer {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
    }

    draw(state) {
        const ctx = this.ctx;

        ctx.clearRect(0, 0, 800, 500);

        // TEMP: draw step info
        ctx.font = "20px Arial";
        ctx.fillText(JSON.stringify(state), 50, 250);
    }
}
