export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.currentAlgorithm = null;
        this.currentState = null;
        this.isPlaying = false;
    }

    setAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
    }

    setPlaybackState(isPlaying) {
        this.isPlaying = isPlaying;
    }

    redraw() {
        if (this.currentState) {
            this.draw(this.currentState);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlaybackIndicator() {
        const badgeWidth = 78;
        const badgeHeight = 42;
        const x = this.canvas.width - badgeWidth - 18;
        const y = 18;

        this.ctx.save();
        this.ctx.fillStyle = this.isPlaying ? "rgba(26, 94, 32, 0.9)" : "rgba(72, 78, 92, 0.9)";
        this.ctx.strokeStyle = this.isPlaying ? "#123d16" : "#313742";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, badgeWidth, badgeHeight, 12);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "24px Arial";
        this.ctx.fillText(this.isPlaying ? "▶" : "⏸", x + badgeWidth / 2, y + badgeHeight / 2 + 1);
        this.ctx.restore();
    }

    draw(state) {
        this.currentState = state;
        this.clear();

        if (!this.currentAlgorithm || typeof this.currentAlgorithm.draw !== "function") {
            return;
        }

        this.currentAlgorithm.draw({
            ctx: this.ctx,
            canvas: this.canvas,
            state,
        });

        this.drawPlaybackIndicator();
    }
}
