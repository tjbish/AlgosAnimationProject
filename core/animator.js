export class Animator {
    constructor(updateCallback) {
        this.interval = null;
        this.generator = null;
        this.speed = 1000;
        this.updateCallback = updateCallback;
    }


    setGenerator(gen) {
        this.generator = gen;
    }

    play() {
        if (!this.generator) return;

        this.interval = setInterval(() => {
            const result = this.generator.next();
            if (!result.done) {
                this.updateCallback(result.value);
            } else {
                this.pause();
            }
        }, this.speed);
    }

    pause() {
        clearInterval(this.interval);
    }

    step() {
        if (!this.generator) return;
        const result = this.generator.next();
        if (!result.done) {
            this.updateCallback(result.value);
        }
    }

    reset() {
        this.pause();
        this.generator = null;
    }


}
