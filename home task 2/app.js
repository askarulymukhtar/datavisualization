var margin = 200;
var svg = d3.select("svg");
var width = svg.attr("width") - margin;
var height = svg.attr("height") - margin;
var tip = d3.tip().attr("class","d3-tip").html((d)=>d);

svg.call(tip)
svg.append("text")
.attr("transform","translate(100,0)")
.attr("x",50)
.attr("y",50)
.attr("class","title")
.text("Some data at the Bar");



var xScale = d3.scaleBand().range([0, width]).padding(0.4);
var yScale = d3.scaleLinear().range([height,0]);

var g = svg.append("g");
g.attr("transform","translate(100,100)");

var data = [
  {year:2010, val: 6},
  {year:2011, val: 14},
  {year:2012, val: 21},
  {year:2013, val: 34},
  {year:2014, val: 56},
  {year:2016, val: 45},
  {year:2017, val: 57},
  {year:2019, val: 61},
];

xScale.domain(data.map(function(d) { return d.year;}));
yScale.domain([0,d3.max(data, function(d) {return d.val;})]);

g.append("g")
.attr("transform","translate(0,"+height+")")
.call(d3.axisBottom(xScale));


g.append("g")
.call(d3.axisLeft(yScale));

function onMouseOver(d,i) {
  d3.select(this)
    .attr('class','highlight');

  d3.select(this)
  .transition()
  .duration(500)
  .attr('width', xScale.bandwidth()+5)
  .attr("y", (d)=>yScale(d.val)-10)
  .attr("height", (d)=>height-yScale(d.val)+10);

  tip.show(d, this);

}

function onMouseOut(d,i) {
  d3.select(this)
  .attr('class','bar');

  d3.select(this)
  .transition()
  .duration(500)
  .attr('width', xScale.bandwidth())
  .attr("y", (d)=>yScale(d.val))
  .attr("height", (d)=>height-yScale(d.val));

  tip.hide();

}


g.selectAll(".bar")
.data(data)
.enter()
.append("rect")
.attr("class","bar")
.on("mouseover", onMouseOver)
.on("mouseout", onMouseOut)
.attr("x", (d)=>xScale(d.year))
.attr("y", (d)=>yScale(d.val))
.attr("width", xScale.bandwidth())  
.transition()
.ease(d3.easeLinear)
.duration(500)
.delay((d,i)=>i*50)
.attr("height", (d)=>height-yScale(d.val));
