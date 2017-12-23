/*jshint esversion: 6 */
define(['mozart'], function (mozart) {

	var levelData = mozart(function(prototype, _, _protected, __, __private) {
		prototype.levels = [{
		"instructions": `
			<h1>Level 1</h1>
			<p>
			Beep boop! If you don't know what JavaScript is then watch <a href="https://www.youtube.com/watch?v=Ukg_U3CnJWI" target="_blank">this 12 minute video</a>.<br>
			Now that that's out of the way and you kinda sorta know what JavaScript is, let's get started.
			<br>
			Every level has its separate instructions as there's too much to learn at once.
			<br><br>Click on the Console tab where it says: <code>robot.move(10);</code> and then hit Enter.
			<br>Whoa! Did you see that? The robot executed your command and moved to the right, it even caught a coin! Do it again!<br><br>
			You can vary how far the robot moves when you call the <code>move</code> method. From <code>-20</code> (negative values move it to the left) to <code>20</code>.
			Every time the robot does an action it uses up energy, go to the Properties tab to check how much energy you have left.
			<br><br>OK, now get your robot to the far right end where the flag is, to win the level. <br>
			You can either keep giving the robot commands by hitting Enter over and over like a chump, or you can use a loop.
			<br><br>
			Go to the Script tab, it will have the following code:
			</p>
			<pre>function init(robot){
	// your code here
}

function loop(robot){
	// your code here
}</pre>
<p>
		Inside the <code>loop</code> function, replace the line: <code>// your code here</code> with: <code>robot.move(10)</code>. Then click Apply.
		<br><br>
		Well done!<br><br>
		</p>
		`,
		"player": {"x": 40, "y": 180},
		"coins": [
		],
		"boxes": [{x: 40, y: 234}],
		//"turrets": [{x: 400, y: 328}],
		"batteries": [],
		"flag": {x: 1500, y: 322},
		"sparkstrips": [],
		"walls": {"origin": [0,0],
			"data":["                                         ",
					"| /                                      ",
					"| /                                      ",
					"| /                                     /",
					"| /                                     /",
					"| ^_________________                    /",
					"|                                       /",
					".------v <------------------------------,",
					"       .-,                               "]
				}
			},

			{
			"instructions": `
				<h1>Level 2</h1>
				<p>
				Now for a little twist... There are obstacles in the way.<br>
				Luckily, the robot can jump! Go to the Console tab, type in <code>robot.jump()</code> and then hit Enter.<br><br>
				Cool! Now to write a simple script, let's try making the robot jump, move forward, jump, move forward and repeat...
				<br><br>
				Try to use this as your robot's <code>loop()</code> function:
				<pre>function loop(robot){
	robot.jump();
	robot.move(4);
}
</pre>
				Silly robot, it's trying to plough through the obstacle! This is happening because the robot only executes the very <i>last</i> command you give it.
				The robot executes functions at 3Hz (3 times a second), so ignoring all but the last command prevents the build-up of a queue.
				<br><br>
				Okay, let's try a different approach.<br>
				We'll need the <code>init</code> function, this initializes the robot with custom variables or methods before the loop starts running.<br>Let's see how it works:
				<br><br>
				Go to the Script tab and in the <code>init</code> function replace the comment with <code>robot.number = 0;</code>.<br>
				Now when you click apply, the robot will hold a variable named <code>number</code> which initializes to <code>0</code>.
				<br><br>
				Then type the following in the <code>loop</code> function:
				</p>
				<pre>if(robot.number % 2 == 0){
	robot.jump()
} else {
	robot.move(2)
}
robot.number++;
</pre>
<p>
<br>
The <code>robot.number % 2 == 0</code> expression in the if-statement checks whether the remainder after dividing <code>robot.number</code> by <code>2</code> is zero. So if <code>robot.number</code> is even the robot jumps, if it's odd the robot moves forward.
<br><br>
<code>robot.number++</code> increments the <code>number</code> variable stored in the robot by <code>1</code> before repeating the loop again, this way the robot will alternate between jumping and moving.
<br><br>
The full code can be shortened to the following:
</p>
<pre>
function init(robot){
	robot.number = 0;
}

function loop(robot){
	robot.jump();
	if(robot.number++ % 2 == 0){
		robot.move(2);
	}
}
</pre>
			`,
			"player": {"x": 100, "y": 200},
			"coins": [
			],
			"batteries": [],
			"boxes": [{x:100,y:100}],
			"flag": {x: 1500, y: 322},
			"portals": [{x: 18, y: 317, properties: {portalDestination: {x: 422, y: 319, d: 3}}},{x: 422, y: 317, properties: {portalDestination: {x: 18,y: 319, d: 1}}}],
			"sparkstrips": [],
			"walls": {"origin": [0,0],
				"data":["            ",
						"            ",
						"|    /|    /",
						"|    /|    /",
						"|    /|    /",
						"|    /|    /",
						"|    /|    /",
						"|    ^>    /",
						"|          /",
						".----------,"]
					}
				},


				{
			"instructions": `
				<h1>Level 3</h1>
				<p>
				The spark strip damages your robot, every time you touch it you lose 20% health.<br>
				If your robot dies, it won't respond to any of your commands, neither from the Script tab or the Console tab.<br><br>
				You can use the <code>robot.info()</code> method to get an object containing:
				<br><code>x</code> x position
				<br><code>y</code> y position
				<br><code>vx</code> x velocity
				<br><code>vy</code> y velocity
				<br><code>ax</code> x acceleration
				<br><code>ay</code> y acceleration
				<br><code>t</code> the time (increases by 10 with every iteration of the <code>loop</code> function)
				<br><code>coins</code> number of coins collected
				<br><code>energy</code> % energy level remaining
				<br><code>health</code> % health remaining
				<br><code>nextMove</code> string of the robot's next move
				<br><br>
				Use <code>robot.info().x</code> to access the information in the script, replacing <code>x</code> with any of the above variables.<br><br>
				You can also use <code>Game</code> to get information about the elements in the current level, for example to get the x position of the spark strip use: <code>Game.sparkstrips[0].x</code>
				<br><br>
				You're on your own.
				</p>
			`,
			"player": {"x": 180, "y": 200},
			"coins": [
				{x: 200,y: 100},
				{x: 600,y: 100},
				{x: 1100,y: 100},
				{x: 1200,y: 100},
				{x: 1300,y: 100},
				{x: 1400,y: 100}
			],
			"batteries": [],
			"turrets": [{x: 400, y: 328, properties: {shootingRate: 30, turned :false}}],
			//"enemies": [{x: 360, y: 322, properties: {x2: 300, y2: 155, v: 1}}],
			"gunEnemies": [{x: 360, y: 322, properties: {x2: 300, y2: 155, v: 1, shootingRate: 30}}],
			"lifts": [{x: 160, y: 355, properties: {x2: 160, y2: 155, v: 1}}],
			"sparkstrips": [],
			"flag": {x: 1500, y: 322},
			"spikes": [{x: 700, y: 332}, {x: 740, y: 332}, {x: 780, y: 332}],
			"walls": {"origin": [0,0],
				"data":["                                         ",
						"                                         ",
						"                                         ",
						"|                                       /",
						"|                                       /",
						"|                                       /",
						"|                                       /",
						"|                                       /",
						"|                                       /",
						".--v      <-----------------------------,",
						"   .------,                              "]
					}
				},





{
		"instructions": `
			<h1>Level 4</h1>
			<p>
			How deep does the rabbit hole go?
			</p>
		`,
	"player": {"x": 100, "y": 140},
	"coins": [
		{x: 1520, y: 140},
		{x: 40, y: 340},
		{x: 1520, y: 540},
		{x: 40, y: 740},
		{x: 1520, y: 940},
		{x: 40, y: 1140},
		{x: 1520, y: 1340},
		{x: 40, y: 1540},
	],
	"batteries": [{x: 500, y: 1000}],
	"flag": {x: 1500, y: 1802},
	"sparkstrips": [],
	"walls": {"origin": [0,0],
		"data":["                                        ",
				"                                        ",
				"                                        ",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				".----------------------------------v   /",
				"`__________________________________>   /",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				"|   <----------------------------------,",
				"|   ^__________________________________'",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				".----------------------------------v   /",
				"`__________________________________>   /",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				"|   <----------------------------------,",
				"|   ^__________________________________'",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				".----------------------------------v   /",
				"`__________________________________>   /",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				"|   <----------------------------------,",
				"|   ^__________________________________'",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				".----------------------------------v   /",
				"`__________________________________>   /",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				"|   <----------------------------------,",
				"|   ^__________________________________'",
				"|                                      /",
				"|                                      /",
				"|                                      /",
				".--------------------------------------,",
]

			}
},

	{
			"instructions": `
				<h1>Level 5</h1>
			<p>
				Apply the brakes with <code>robot.move(-robot.info().vx)</code>
				<br><br>
			</p>
			`,
			"player": {"x": 100, "y": 200},
			"coins": [
				{x: 200,y: 140},
				{x: 200,y: -5},
			],
		"boxes": [
				{x: 200,y: 40},
		],
			"batteries": [],
			"flag": {x: 1700, y: 322},
			"sparkstrips": [{x: 460, y: 332}, {x: 640, y: 252}],
			"walls": {"origin": [0,0],
				"data":["                                              ",
						"                                              ",
						"                                              ",
						"|                                            /",
						"|                                            /",
						"|                                            /",
						"|                                            /",
						"|            <---v                           /",
						"|            /   |                           /",
						".------------,   .---------------------------,"]
					}


				},


	{
			"instructions": `
				<h1>Level 6</h1>
			<p>
				You know the drill.
				<br><br>
				<code>robot.gun()</code> might be useful to collect the coins on top of the spark strips without damaging the robot.<br><br>
				<br><br>
			</p>
			`,
			"player": {"x": 100, "y": 200},
			"coins": [
				{x: 200,y: 100},
				{x: 300,y: 100},
				{x: 400,y: 100},
				{x: 500,y: 100},
				{x: 600,y: 100},
				{x: 700,y: 100},
				{x: 800,y: 100},
				{x: 900,y: 100},
				{x: 1000,y: 100},
				{x: 1100,y: 100},
				{x: 1200,y: 100},
				{x: 1300,y: 100},
				{x: 1400,y: 100},
				{x: 1500,y: 100},
				{x: 1600,y: 100},
				{x: 1700,y: 100},
				{x: 1800,y: 100},
				{x: 1900,y: 100},
				{x: 2000,y: 100},
				{x: 2100,y: 100},
				{x: 2200,y: 100},
				{x: 2300,y: 100},
				{x: 2400,y: 100}
			],
			"batteries": [],
			"flag": {x: 2500, y: 322},
			"sparkstrips": [{x: 500, y: 332}, {x: 900, y: 332}, {x: 1300, y: 332}, {x: 1700, y: 332}, {x: 2100, y: 332}],
			"walls": {"origin": [0,0],
				"data":["                                                                  ",
						"                                                                  ",
						"                                                                  ",
						"|                                                                /",
						"|                                                                /",
						"|                                                                /",
						"|                                                                /",
						"|                                                                /",
						"|                                                                /",
						".----------------------------------------------------------------,"]
					}
				},




			];

	});
	return levelData;
});



/*
];*/
