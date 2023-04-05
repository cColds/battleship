export default class Ship {
	constructor(length) {
		this.length = length;
		this.timesHit = 0;
		this.coords = null;
	}

	hit() {
		if (this.timesHit !== this.length) this.timesHit += 1;
	}

	isSunk() {
		return this.length === this.timesHit;
	}
}
