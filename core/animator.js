export class Animator {
    constructor(onFrame, onPlaybackChange = () => {}) {
        this.interval = null;
        this.generatorFactory = null;
        this.generator = null;
        this.speed = 1750;
        this.onFrame = onFrame;
        this.onPlaybackChange = onPlaybackChange;
    }

    setGeneratorFactory(generatorFactory) {
        this.pause();
        this.generatorFactory = generatorFactory;
        this.generator = null;
    }

    restart() {
        if (!this.generatorFactory) {
            this.generator = null;
            return;
        }

        this.generator = this.generatorFactory();
    }

    play() {
        if (!this.generatorFactory) {
            return;
        }

        if (!this.generator) {
            this.restart();
        }

        this.pause();
        this.interval = setInterval(() => {
            this.step();
        }, this.speed);
        this.onPlaybackChange(true);
    }

    pause() {
        const wasPlaying = this.interval !== null;
        clearInterval(this.interval);
        this.interval = null;
        if (wasPlaying) {
            this.onPlaybackChange(false);
        }
    }

    step() {
        if (!this.generatorFactory) {
            return;
        }

        if (!this.generator) {
            this.restart();
        }

        const result = this.generator.next();
        if (result.done) {
            this.pause();
            return;
        }

        this.onFrame(result.value);
    }

    reset() {
        this.pause();
        this.restart();
    }
}
