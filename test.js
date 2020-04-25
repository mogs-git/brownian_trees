function setup() {
	createCanvas(100,100)
}

function draw() {
	strokeWeight(5);
	point(50,50)
	console.log(atan2(mouseY-50, mouseX-50))
}