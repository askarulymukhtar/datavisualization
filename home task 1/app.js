
const DATA = []
for (let i = 0; i < 40; i++){
	DATA.push([Math.floor(Math.random()*10),Math.floor(Math.random()*10)])
}
DATA.forEach(data => document.getElementById('Random_var').innerHTML = document.getElementById('Random_var').innerHTML +"[" + data+"] ")

const container = d3.select("svg")


var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var svg = d3.select("svg")
	.classed('container',true)
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
    .domain([0, 10])
    .range([ 0, width ]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

var y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

DATA_small = []
DATA_big = []

DATA.forEach(data => {
	if (data[0] < 5){
		DATA_small.push(data)
	} else {
		DATA_big.push(data)
	}
})

DATA_small.forEach(data => document.getElementById('DATA_small').innerHTML = document.getElementById('DATA_small').innerHTML +"[" + data+"] ")
DATA_big.forEach(data => document.getElementById('DATA_big').innerHTML = document.getElementById('DATA_big').innerHTML +"[" + data+"] ")

svg.append('g')
	.selectAll("dot")
	.data(DATA_small).enter()
	.append("circle")
	.attr("cx", function (d) { return x(d[0]); } )
	.attr("cy", function (d) { return y(d[1]); } )
	.attr("r", 3)
	.style("fill", "red");

svg.append('g')
	.selectAll("dot")
	.data(DATA_big)
	.enter()
	.append('rect')	
    .attr("x", function (d) { return (x(d[0]) - 2.5); }) 
    .attr("y", function (d) { return (y(d[1]) - 2.5); })
	.attr("width", 5)
    .attr("height", 5)
	.style("fill","blue");