export default class Ship {
	constructor(length) {
		this.length = length;
		this.timesHit = 0;
	}

	hit() {
		if (this.timesHit !== this.length) this.timesHit += 1;
	}
}
