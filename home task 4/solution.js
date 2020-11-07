var width = 1000, height = 500;

var colors = d3.scaleOrdinal(d3.schemeDark2);

var svg = d3.select("body").append("svg")
    .attr("width", width).attr("height", height)
    .style("background", "lightgreen")

var newData = d3.json("newData.json");


var details = [
    {Committee: "Комитет по социально-культурному развитию", number: 14},
    {Committee: "Комитет по аграрным вопросам Мажилиса Парламента", number: 12},
    {Committee: "Комитет по законодательству и  судебно-правовой реформе", number: 10},
    {Committee: "Комитет по финансам и бюджету", number: 13},
    {Committee: "Комитет по экономической реформе и региональному развитию", number: 12},
    {Committee: "Комитет по международным делам", number: 13},
    {Committee: "Комитет по вопросам экологии и природопользованию", number: 11},
    {Committee: "Руководящий состав Мажилиса", number: 2},
]
var data = d3.pie().sort(null).value(function(d){return d.number;})(details);
var segments = d3.arc()
    .innerRadius(0)
    .outerRadius(200)
    .padAngle(.05)
    .padRadius(50)
var sections = svg.append("g").attr("transform", "translate(250,250)")
    .selectAll("path").data(data);
sections.enter().append("path").attr("d", segments).attr("fill", function(d) {return colors(d.data.number);});

var content = d3.select("g").selectAll("text").data(data);

content.enter().append("text").classed("inside", true).each(function(d){
    var center = segments.centroid(d);
    d3.select(this).attr("x", center[0]).attr("y", center[1]).text(d.data.number);
});

var legends = svg.append("g").attr("transform", "translate(500, 100)").selectAll(".legends").data(data);
var legend = legends.enter().append("g").classed("legends", true).attr("transform", function(d,i){return "translate(0,"+(i+1)*30+")";});

legend.append("rect").attr("width", 20).attr("height", 20).attr("fill", function(d){return colors(d.data.number);});
legend.append("text").classed("label", true).text(function(d){return d.data.Committee;})
    .attr("fill", function(d){return colors(d.data.number);})
    .attr("x", 30)
    .attr("y", 15);