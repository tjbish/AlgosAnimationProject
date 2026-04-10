export class Animator {
	constructor(onFrame) {
		this.interval = null;
		this.generatorFactory = null;
		this.generator = null;
		this.speed = 1750;
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
		//Document.getElementById("playBtn").classList.add("inactive");

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
		//Document.getElementById("playBtn").classList.remove("inactive");

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
