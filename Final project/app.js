//
// Configuration
//

// ms to wait after dragging before auto-rotating
var rotationDelay = 0
// scale of the globe (not the canvas element)
var scaleFactor = 1
// autorotation speed
var degPerSec = 3
// start angles
var angles = { x: -20, y: 40, z: 0}
// colors
var colorWater = '#009dc4'
var colorLand = '#d47b4a'
var colorGraticule = '#000'
var colorCountry = '#130A6A'


//
// Handler
//

function enter(country) {
  var country = countryList.find(function(c) {
    return parseInt(c.id, 10) === parseInt(country.id, 10)
  })
  current.text(country && country.name || '')
  createBars(country)
  InfectedBars(country)
}

function leave(country) {
  current.text('')
  d3.selectAll("svg > *").remove()
}

//
// Variables
//

var current = d3.select('#current')
var canvas = d3.select('#globe')
var context = canvas.node().getContext('2d')
var water = {type: 'Sphere'}
var projection = d3.geoOrthographic().precision(0.1)
var graticule = d3.geoGraticule10()
var path = d3.geoPath(projection).context(context)
var v0 // Mouse position in Cartesian coordinates at start of drag gesture.
var r0 // Projection rotation as Euler angles at start.
var q0 // Projection rotation as versor at start.
var lastTime = d3.now()
var degPerMs = degPerSec / 1000
var width, height
var land, countries
var countryList
var autorotate, now, diff, roation
var currentCountry

//
// Creating bar
//

function createBars(country) {
  const margin = 60;
  const barwidth = 420 - 2 * margin;
  const barheight = 420 - 2 * margin;

  const svg = d3.select('svg')

  const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`)

  const yScale = d3.scaleLinear()
    .range([barheight, -20])
    .domain([-20, 20])

  chart.append('g')
    .call(d3.axisLeft(yScale))
    .attr('color', 'lightblue')

  const quaters = [
    {q:"Q1", value:country.Q1},
    {q:"Q2", value:country.Q2},
    {q:"Q3", value:country.Q3}
  ]
    
  const xScale = d3.scaleBand()
  .range([0, barwidth])
  .domain(quaters.map((s) => s.q))
  .padding(0.2)

  chart.append('g')
    .attr('transform', `translate(0, ${barheight})`)
    .call(d3.axisBottom(xScale));

  chart.selectAll()
  .data(quaters)
  .enter()
  .append('rect')
  .attr('x', (s) => xScale(s.q))
  .attr('y', (s) => yScale(s.value))
  .attr('height', (s) => barheight - yScale(s.value))
  .attr('width', xScale.bandwidth())
}

function InfectedBars(country) {
  const margin = 60;
  const barwidth = 420 - 2 * margin;
  const barheight = 420 - 2 * margin;

  const svg = d3.select('#svg1')

  const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`)

  const yScale = d3.scaleLinear()
    .range([barheight, -20])
    .domain([0, 20000000])

  chart.append('g')
    .call(d3.axisLeft(yScale))
    .attr('color', 'lightblue')

  const months = [
    {m:"m1", value:country.m1},
    {m:"m2", value:country.m2},
    {m:"m3", value:country.m3},
    {m:"m4", value:country.m4},
    {m:"m5", value:country.m5},
    {m:"m6", value:country.m6},
    {m:"m7", value:country.m7},
    {m:"m8", value:country.m8},
    {m:"m9", value:country.m9},
    {m:"m10", value:country.m10},
    {m:"m11", value:country.m11},
    {m:"m12", value:country.m12}
  ]
    
  const xScale = d3.scaleBand()
  .range([0, barwidth])
  .domain(months.map((s) => s.m))
  .padding(0.2)

  chart.append('g')
    .attr('transform', `translate(0, ${barheight})`)
    .call(d3.axisBottom(xScale));

  chart.selectAll()
  .data(months)
  .enter()
  .append('rect')
  .attr('x', (s) => xScale(s.m))
  .attr('y', (s) => yScale(s.value))
  .attr('height', (s) => barheight - yScale(s.value))
  .attr('width', xScale.bandwidth())
}

//
// Functions
//

function setAngles() {
  var rotation = projection.rotate()
  rotation[0] = angles.y
  rotation[1] = angles.x
  rotation[2] = angles.z
  projection.rotate(rotation)
}

function scale() {
  width = document.documentElement.clientWidth
  height = document.documentElement.clientHeight-200
  canvas.attr('width', width).attr('height', height)
  projection
    .scale((scaleFactor * Math.min(width, height)) / 2)
    .translate([width / 2, height / 2])
  render()
}

function startRotation(delay) {
  autorotate.restart(rotate, delay || 0)
}

function stopRotation() {
  autorotate.stop()
}

function dragstarted() {
  v0 = versor.cartesian(projection.invert(d3.mouse(this)))
  r0 = projection.rotate()
  q0 = versor(r0)
  stopRotation()
}

function dragged() {
  var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)))
  var q1 = versor.multiply(q0, versor.delta(v0, v1))
  var r1 = versor.rotation(q1)
  projection.rotate(r1)
  render()
}

function dragended() {
  startRotation(rotationDelay)
}

function render() {
  context.clearRect(0, 0, width, height)
  fill(water, colorWater)
  stroke(graticule, colorGraticule)
  fill(land, colorLand)
  if (currentCountry) {
    fill(currentCountry, colorCountry)
  }
}

function fill(obj, color) {
  context.beginPath()
  path(obj)
  context.fillStyle = color
  context.fill()
}

function stroke(obj, color) {
  context.beginPath()
  path(obj)
  context.strokeStyle = color
  context.stroke()
}

function rotate(elapsed) {
  now = d3.now()
  diff = now - lastTime
  if (diff < elapsed) {
    rotation = projection.rotate()
    rotation[0] += diff * degPerMs
    projection.rotate(rotation)
    render()
  }
  lastTime = now
}

function loadData(cb) {
  d3.json('https://unpkg.com/world-atlas@1/world/110m.json', function(error, world) {
    if (error) throw error
    d3.tsv('data_DVV.tsv', function(error, countries) {
      if (error) throw error
      cb(world, countries)
    })
  })
}

// https://github.com/d3/d3-polygon
function polygonContains(polygon, point) {
  var n = polygon.length
  var p = polygon[n - 1]
  var x = point[0], y = point[1]
  var x0 = p[0], y0 = p[1]
  var x1, y1
  var inside = false
  for (var i = 0; i < n; ++i) {
    p = polygon[i], x1 = p[0], y1 = p[1]
    if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside
    x0 = x1, y0 = y1
  }
  return inside
}

function mousemove() {
  var c = getCountry(this)
  if (!c) {
    if (currentCountry) {
      leave(currentCountry)
      currentCountry = undefined
      render()
    }
    return
  }
  if (c === currentCountry) {
    return
  }
  currentCountry = c
  render()
  d3.selectAll("svg > *").remove()
  enter(c)
}

function getCountry(event) {
  var pos = projection.invert(d3.mouse(event))
  return countries.features.find(function(f) {
    return f.geometry.coordinates.find(function(c1) {
      return polygonContains(c1, pos) || c1.find(function(c2) {
        return polygonContains(c2, pos)
      })
    })
  })
}


//
// Initialization
//

setAngles()

canvas
  .call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
   )
  .on('mousemove', mousemove)

loadData(function(world, cList) {
  land = topojson.feature(world, world.objects.land)
  countries = topojson.feature(world, world.objects.countries)
  countryList = cList
  
  window.addEventListener('resize', scale)
  scale()
  autorotate = d3.timer(rotate)
})

//
// Slider 
//
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}