import * as d3 from './../lib/d3'
import $ from './../lib/jquery'

export class Animal {

	constructor(data) {

		var self = this;

		this.totality = 69322 // Total number of animals on the voyage of death

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

	initialize() {


	var mobileDevice = false;

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	  mobileDevice = true;
	}   

	var width = $("#squaresContainer").width();

	var sheepData = this.database

	/*

	var sheepData = [{"day":1,"dead":1,"total":75508,"live":75507,"temperature":14.49},
				{"day":2,"dead":3,"total":75508,"live":75505,"temperature":13.4},
				{"day":3,"dead":4,"total":75508,"live":75504,"temperature":14.3},
				{"day":4,"dead":10,"total":75508,"live":75498,"temperature":16.0},
				{"day":5,"dead":10,"total":75508,"live":75498,"temperature":16.7},
				{"day":6,"dead":10,"total":75508,"live":75498,"temperature":17.4},
				{"day":7,"dead":12,"total":75508,"live":75496,"temperature":19.5},
				{"day":8,"dead":13,"total":75508,"live":75495,"temperature":20.4},
				{"day":9,"dead":14,"total":75508,"live":75494,"temperature":23.5},
				{"day":10,"dead":17,"total":75508,"live":75491,"temperature":26.8},
				{"day":11,"dead":18,"total":75508,"live":75490,"temperature":29.1},
				{"day":12,"dead":22,"total":75508,"live":75486,"temperature":29.4},
				{"day":13,"dead":30,"total":75508,"live":75478,"temperature":27.8},
				{"day":14,"dead":35,"total":75508,"live":75473,"temperature":27.8},
				{"day":15,"dead":41,"total":75508,"live":75467,"temperature":27.8},
				{"day":16,"dead":47,"total":75508,"live":75461,"temperature":27.4},
				{"day":17,"dead":52,"total":75508,"live":75456,"temperature":26.9},
				{"day":18,"dead":59,"total":75508,"live":75449,"temperature":26.9},
				{"day":19,"dead":66,"total":75508,"live":75442,"temperature":28.7},
				{"day":20,"dead":76,"total":75508,"live":75432,"temperature":32.5},
				{"day":21,"dead":4126,"total":75508,"live":71382,"temperature":29.4},
				{"day":22,"dead":4168,"total":75508,"live":71340,"temperature":28.1},
				{"day":23,"dead":4168,"total":75508,"live":71340,"temperature":28.8},
				{"day":24,"dead":4168,"total":75508,"live":71340,"temperature":26.7},
				{"day":25,"dead":4168,"total":75508,"live":71340,"temperature":23.8},
				{"day":26,"dead":4168,"total":75508,"live":71340,"temperature":24.5},
				{"day":27,"dead":4172,"total":75508,"live":71336,"temperature":24.4},
				{"day":28,"dead":4172,"total":75508,"live":71336,"temperature":25.4},
				{"day":29,"dead":4172,"total":75508,"live":71336,"temperature":27.1},
				{"day":30,"dead":4172,"total":75508,"live":71336,"temperature":30.2},
				{"day":31,"dead":4172,"total":75508,"live":71336,"temperature":30.4},
				{"day":32,"dead":4179,"total":75508,"live":71329,"temperature":29.9}];

				*/
	
	

	var squareSize = 4,
    gap = 1;
    var squareColour = d3.scale.linear().domain([0, 1]).range(["#197caa","#951c55"]);

    var squaresPerRow = Math.floor(width/(squareSize+gap));
    var height = (this.totality / squaresPerRow)*(squareSize+gap) + 10;

	$('#sliderbot').on('propertychange input', function (e) {
		updateGraphic($(this).val())
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
    //console.log(dayData);

    var margin = {top: 20, right: 20, bottom: 25, left: 30};
    var gW = width - margin.left - margin.right;
    if (width < 600) {
    	var gH = width*0.4 - margin.top - margin.bottom;
    }
	else {
		var gH = width*0.2 - margin.top - margin.bottom;
	}
		
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
	function updateGraphic(day) {
		var uptoData = sheepData.filter(function(d) { return d.day <= parseInt(day)+1});
		path
			.transition()
	        .duration(1000)
	        .attrTween('d', pathTween);   
		
		function pathTween() {
            var interpolate = d3.scale.quantile()
		      .domain([0,1])
		      .range(d3.range(1, uptoData.length));

		  return function(t) {
		      return line(uptoData);
		      }
    	}

    	if (mobileDevice === false) {
	    	dayData = generateSqData(sheepData[day]);

			dayData.forEach(function(d,i) {
				context.beginPath();
			    context.fillStyle = squareColour(d);
			    let col = i%squaresPerRow;
	         	let rectX = (col*squareSize) + (col*gap);
	         	let row = Math.floor(i/squaresPerRow);
	        	let rectY = (row*squareSize) + (row*gap);
			    context.fillRect(rectX,rectY,squareSize,squareSize);	
			    context.fill();
			    context.closePath();
			
			});

    	}
		

		d3.select("#deadNumber")
			.transition()
		    .duration(500)
		        .tween("text", function(d) {
		            var i = d3.interpolate(this.textContent, sheepData[day]['dead']);
		            return function(t) {
		                this.textContent = Math.round(i(t));
		            };
		        });

		d3.select("#dayNumber")
			.text(parseInt(day)+1);        


	};
	
	updateGraphic(0);



	}


}