import * as d3 from './../lib/d3'
import $ from './../lib/jquery'

export class Animal {

	constructor(data) {

		var self = this;

		this.totality = 69322 // Total number of animals on the voyage of death

		this.location = 0

		this.voyage = 22

		// Create the database
		this.database = data.sheets.Sheet1

        this.database.forEach(function(item) {

            item['day'] = +item['Day'];

            item['temperature'] = +item['Highest wet bulb temperature'];

            item['dead'] = +item['Adjusted cumulative mortality'];

            item['live'] = self.totality - item['Adjusted cumulative mortality'];

            item['total'] = self.totality;

        })

		// Initialize the app
		this.initialize()

	}

	autopilot() {

		if (this.location < this.voyage) {
			this.location++
			$('#sliderbot').val(this.location)

		} else {
			this.location = 0
			$('#sliderbot').val(this.location)
		}

		this.updateGraphic(this.location)

	}

	initialize() {

		var self = this;

		var mobileDevice = false;

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		  mobileDevice = true;
		}   

		var width = $("#squaresContainer").width();

		var sheepData = this.database
	
		var squareSize = 4, gap = 1;

	    var squareColour = d3.scale.linear().domain([0, 1]).range(["#197caa","#951c55"]);

	    var squaresPerRow = Math.floor(width/(squareSize+gap));

	    var height = (this.totality / squaresPerRow) * (squareSize + gap) + 10;

		$('#sliderbot').on('propertychange input', function (e) {
			self.updateGraphic($(this).val())

			if (self.delayered!=null) {
				clearInterval(self.delayered);
			    self.delayered = null
			}

		});

	    function generateSqData(input) {

	    	var dayData = [];
	    	var countVar,remainder;
	    	countVar = Math.ceil(input['dead']/10);
	    	remainder = parseFloat(String(input['dead']/10).split(".")[1])/10;

	    	for (var i = 0; i < countVar; i++) {

	    		//push a value of 1 for everyone but the last

				if (i != countVar-1 ) {
					dayData.push(1);
				}

				if (i == countVar-1 ) {
					if (isNaN(remainder) == true) {
						dayData.push(1);
					}
					else {
						dayData.push(remainder);
					}
					
				}
				
			};

			countVar = Math.floor(input['live']/10);

			for (var i = 0; i < countVar; i++) {
				dayData.push(0);
			};

			return dayData;
	    }

	    var dayData = generateSqData(sheepData[0]);

	    var margin = {top: 20, right: 20, bottom: 25, left: 30};

	    var gW = width - margin.left - margin.right;

		var gH = (width < 600) ? width*0.4 - margin.top - margin.bottom : width*0.2 - margin.top - margin.bottom;
			
		var gX = d3.scale.linear()
			.range([0, gW]);

		var gY = d3.scale.linear()
			.range([gH, 0]);

		var xAxis = d3.svg.axis()
			.scale(gX)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(gY)
			.orient("left");        		

		var line = d3.svg.line()
			.x(function(d) { return gX(d.day); })
			.y(function(d) { return gY(d.temperature); });			    

		gX.domain(d3.extent(sheepData, function(d) { return d.day; }));

		gY.domain([0, 35]);			    

		var graphSvg = d3.select("#tempContainer").append("svg")
			.attr("width", gW + margin.left + margin.right)
			.attr("id", "tempSvg")
			.attr("height", gH + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");		    

		graphSvg.append("rect")
			.attr("y", gY(30.6))
			.attr("class","heatStress")
	        .attr("width", gW)
	      	.attr("height", 1); 	    

		var path = graphSvg.append('path')
	        .attr('class', 'line')
	        .attr('d', line(sheepData[0]))
	        .attr('stroke-width', function() { 
	        	return "2px"; 
	        });

	    graphSvg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + gH + ")")
			.call(xAxis)
			.append("text")
				.attr("y", "1.2em")
				.attr("x", "3em")
				.text("Day");

		graphSvg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
				.attr("x", 20)
				.attr("dy", ".71em")
				.attr("class", "heatThreshold")
				.style("text-anchor", "right")
				.text("Heat stress threshold");

	    if (mobileDevice === false) {    
			d3.select("#squaresContainer")
				.append("canvas")
					.attr("width", width)
					.attr("height", height)
					.attr("id", "graphicCanvas")			

		    var context = d3.select("#graphicCanvas").node().getContext("2d");  
		}

		if (mobileDevice === true) {
			$("#squareHeader").hide();

		}

		this.updateGraphic = function updateGraphic(day) {

			var uptoData = sheepData.filter(function(d) {
				return d.day <= parseInt(day) + 1
			});

			if ( uptoData.length < 23 ) {
				path.transition().duration(1000).attrTween('d', pathTween);
			}

			function pathTween() {
				var interpolate = d3.scale.quantile().domain([0, 1]).range(d3.range(1, uptoData.length));
				return function(t) {
					return line(uptoData);
				}
			}

			if (mobileDevice === false) {
				dayData = generateSqData(sheepData[day]);
				dayData.forEach(function(d, i) {
					context.beginPath();
					context.fillStyle = squareColour(d);
					let col = i % squaresPerRow;
					let rectX = (col * squareSize) + (col * gap);
					let row = Math.floor(i / squaresPerRow);
					let rectY = (row * squareSize) + (row * gap);
					context.fillRect(rectX, rectY, squareSize, squareSize);
					context.fill();
					context.closePath();
				});
			}

			d3.select("#deadNumber").transition().duration(500).tween("text", function(d) {
				var i = d3.interpolate(this.textContent, sheepData[day]['dead']);
				return function(t) {
					this.textContent = Math.round(i(t));
				};
			});

			d3.select("#dayNumber").text(parseInt(day) + 1);
		};

		this.updateGraphic(0);

		this.delayered = setInterval(function(){ self.autopilot() }, 1000);

	}

}