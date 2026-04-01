export class Animator {
    constructor(onFrame) {
        this.interval = null;
        this.generatorFactory = null;
        this.generator = null;
        this.speed = 1500;
        this.onFrame = onFrame;
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
    }

    pause() {
        clearInterval(this.interval);
        this.interval = null;
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
            this.reset();
            return;
        }

        this.onFrame(result.value);
    }

    reset() {
        this.pause();
        this.restart();
    }
}
