// Utility functions // 

function randomRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function combinations(array1, array2) {
	output_array = [];
	for (let i = 0; i < array1.length; i++) {
		for (let j = 0; j < array2.length; j++) {
			output_array.push([array1[i], array2[j]]);
		}
	}
	return output_array;
}

function getAngle(vec1, vec2) {
	angle = atan2(vec1.y-vec2.y, vec1.x-vec2.x);
	return angle
}

// Classes // 

class Stepper {
	constructor(position) {
		this.position = position;
		this.dx = 0;
		this.dy = 0;
		this.colour = "blue";
		this.dead = false;
	}

	step() {
		if (Math.random(1) < 0.5) {
			this.dx = randomRange(-5,5)
			this.dy = randomRange(-5,5)
		}

		this.position.x += this.dx
		this.position.y += this.dy
	}

	check_collision(trees, branches) {
		trees.forEach((tree) => {
			// let tree_x_coord = (tree.position.x + (tree.radius * cos(getAngle(tree.position, this.position))))
			// let tree_y_coord = (tree.position.y + (tree.radius * sin(getAngle(tree.position, this.position))))
			// // if ((Math.abs(this.position.x - tree_x_coord) <= (tree.radius+10)) && 
			// // 	(Math.abs(this.position.y - tree_y_coord) <= (tree.radius+10))) {
			// // 	branches.push(new BranchSegment(tree_x_coord, tree_y_coord));
			// // 	this.dead = true;
			// // 	this.colour = tree.colour;
			// // }

			if (getDistance(this.position.x,this.position.y, tree.position.x,tree.position.y) <= tree.radius-30) {
				branches.push(new BranchSegment(this.position.x, this.position.y));
				this.dead = true;
				this.colour = tree.colour;
			}
		})

		if (branches.length >0 && !this.dead) {
			let end = branches.length 
			for (let i = 0; i < end; i++) {
				if ((Math.abs(this.position.x - branches[i].x) < 7) && (Math.abs(this.position.y - branches[i].y) < 7)) {
					branches.push(new BranchSegment(this.position.x, this.position.y));
					this.dead = true;
					this.colour = branches[i].colour;
				}
			}
		}
	}

	display(trees, branches) {
		this.check_collision(trees, branches);
		if (!this.dead) {
			noFill();
			stroke(this.colour);
			strokeWeight(10);
			point(this.position.x,this.position.y);
			this.step();
		}
	}
}

class Tree {
	constructor(position) {
		this.position = position;
		this.diameter = 150;
		this.radius = this.diameter/2;
		this.colour = "red";
	}

	display() {
		noStroke()
		fill(this.colour)
		ellipse(this.position.x, this.position.y, this.radius)
		noFill()
		//stroke("red")
		//strokeWeight(1)
		//ellipse(this.position.x, this.position.y, this.radius+10)
	}
}

class BranchSegment {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.colour = "brown";
	}

	display() {
		stroke(this.colour);
		strokeWeight(10);
		point(this.x, this.y);
	}

}

// Initialise
let canvas_width = 800;
let canvas_height = 800;
let trees = [];
let branches = [];
let steppers = [];
let tree_coordinates = combinations([canvas_width*0.66, canvas_width*0.33], [canvas_height*0.33, canvas_height*0.66])
let max_steppers = 200;
let live_steppers = 0;
function get_live_steppers(steppers) {
	let n_alive = 0;
	if (steppers.length == 0) {
		return 0;
	}
	steppers.forEach((stepper) => {
		if (!stepper.dead) {
			n_alive++;
		}
	})
	return n_alive;
}

function setup() {
 createCanvas(canvas_width, canvas_height);
	let tree_vectors = []
	tree_coordinates.map((coordinate) => {tree_vectors.push(createVector(coordinate[0], coordinate[1]))})
	tree_vectors.forEach((coordinate) => {
		trees.push(new Tree(coordinate));
	})

}

function getDistance(x1,y1,x2,y2) {
	return Math.abs(Math.sqrt((x1-x2)**2 + (y1-y2)**2))
}

function draw() {
	clear()
	background("#E0E0E0")

	live_steppers = get_live_steppers(steppers);
	if (live_steppers < max_steppers) {
		while (live_steppers < max_steppers) {
			let x = randomRange(100,canvas_width-100);
			let y = randomRange(100,canvas_height-100);
			let collided = true
			while (collided) {
				let noCollision = 0
				trees.forEach((tree) => {
					if (getDistance(x,y,tree.position.x,tree.position.y) > tree.radius+10) {
						noCollision++
					}
				})
				if (noCollision == 4) {
					collided = false
				} else {
					x = randomRange(100,canvas_width-100);
					y = randomRange(100,canvas_height-100);
				}
			}
			steppers.push(new Stepper(createVector(x, y)));
			live_steppers++;
		}
	}

	steppers.forEach((stepper, index) => {
		stepper.display(trees, branches);
		//console.log((stepper.position.x > canvas_width))
		if (stepper.dead || (stepper.position.x > canvas_width) || stepper.position.x < 0 || stepper.position.y > canvas_height || stepper.position.y < 0) {
			steppers.splice(index, 1);
		}
	})

	trees.forEach((tree) => {
		tree.display(); 

	})

	branches.forEach((branch) => {
		branch.display();
	})

}