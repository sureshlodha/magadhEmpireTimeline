/* ----------------------------------------------------------------------------
Contructs the Multi Line chart using D3
80 characters perline, avoid tabs. Indet at 4 spaces.
-----------------------------------------------------------------------------*/ 

//code to set the margins for the chart and defines margin variables
var margin = {top: 20, right: 80, bottom: 30, left: 70},
    //make the width variable for the chart and the height variable according to the margins
    width = 1500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


//create the svg and append to svg variable to call again later and put it in body section of html
var svg = d3.select("body").append("svg")
    //setting the width and height attributes of the svg using the marging vars defined above
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //use .append("g") to append all svg elements to the DOM
    .append("g")
    //translate the svg by the margins
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dynastyList = ["Bṛhadratha Dynasty", "Pradyota Dynasty", "Śiśunāga Dynasty",
               "Nanda Dynasty", "Maurya Dynasty", "Śuṅga Dynasty", "Kaṇva Dynasty",
               "Magadha Kings", "Śātavāhana Dynasty", "Gupta Dynasty", "Iksvaku Dynasty"];

var x = d3.scaleLinear().range([0, 1000]).domain([3500, 0]),
    x2 = d3.scaleLinear().range([0, 1000]).domain([3500, 0]),
    colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(dynastyList);

var brush = d3.brushX()
    .extent([[150, 170], [1150, 200]])
    .on("start brush end", brushed);

var timeAxis = d3.axisBottom(x),
    timeAxis2 = d3.axisBottom(x2);

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", 1000)
    .attr("height", height)
    .attr("transform", "translate(" + 150 + "," + margin.top + ")"); 

var tooltip = d3.select("body").append("div")	
    .attr("class", "tooltip")
    .style("opacity", 0);

var brusher;

d3.json("timelineData.json").then(function(dynasties){
  console.log(dynasties);
  
  dynastyList.forEach(item => {
    dynasties[item].forEach(function(ruler){
      var distance = 190;
      var scaleDistance = 90;
      
      if(item == "Iksvaku Dynasty"){
        distance = 180;
        scaleDistance = 50;
      } else {
        distance = 190;
        scaleDistance = 90;
      }
      
      var begin = svg.append("circle")
        .attr("cx", x2(ruler.begin)+150)
        .attr("cy", distance)
        .attr("r", 3.5)
        .style("fill", colorScale(item));
      
      var lines = svg.append("line")
        .attr("x1", x2(ruler.begin)+150)
        .attr("y1", distance)
        .attr("x2", x(ruler.end)+150)
        .attr("y2", distance)
        .style("stroke-width", "1")
        .style("stroke", colorScale(item));
      
      var end = svg.append("circle")
        .attr("cx", x2(ruler.end)+150)
        .attr("cy", distance)
        .attr("r", 3.5)
        .style("fill", colorScale(item));
      
      var scaleBegin = svg.append("circle")
        .attr("class", "begin")
        .attr("begin", ruler.begin)
        .attr("cx", x(ruler.begin)+150)
        .attr("cy", scaleDistance)
        .attr("r", 5)
        .style("fill", colorScale(item))
        .on("mouseover", function(d) {
            tooltip.transition()		
                .duration(200)		
                .style("opacity", 1);
            tooltip.style("border-color", colorScale(item));
            tooltip.html("<p>" + item +"<\p><p>" + dynasties["Duration"] + " Years</p>");	
            })					
        .on("mouseout", function(d) {
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
      
      var scaleLines = svg.append("line")
        .attr("class", "connectors")
        .attr("begin", ruler.begin)
        .attr("end", ruler.end)
        .attr("x1", x(ruler.begin)+150)
        .attr("y1", scaleDistance)
        .attr("x2", x(ruler.end)+150)
        .attr("y2", scaleDistance)
        .style("stroke-width", "3")
        .style("stroke", colorScale(item))
        .on("mouseover", function(d) {
          scaleLines.style("opacity", 0.4);
            tooltip.transition()		
                .duration(200)		
                .style("opacity", 1);
            tooltip.style("border-color", colorScale(item));
            tooltip.html("<p>" + ruler.ruler 
            +"<\p>" + item + "</p>" + ruler.duration +"  Years</p><p>" + ruler.begin + " BCE - " + ruler.end + " BCE</p>")
            .style("left", 650 + "px")		
            .style("top", 350 + "px");	
            })
        .on("mouseout", function(d) {
            scaleLines.style("opacity", 1);
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
      
      var scaleEnd = svg.append("circle")
        .attr("class", "end")
        .attr("end", ruler.end)
        .attr("cx", x(ruler.end)+150)
        .attr("cy", scaleDistance)
        .attr("r", 5)
        .style("fill", colorScale(item))
        .on("mouseover", function(d) {
            tooltip.transition()		
                .duration(200)		
                .style("opacity", 1);		
            tooltip.html("<p>" + item +"<\p>");	
            })					
        .on("mouseout", function(d) {	
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
      
//      var label = svg.append("text")
//        .attr("class", "labels")
//        .attr("begin", ruler.begin)
//        .attr("duration", ruler.duration)
//        .attr("x", function(){ return x(ruler.begin - (ruler.duration/2)) + 150})
//        .attr("y", 80)
//        .text(ruler.ruler);
    });
  });

  var gA = svg.append("g")
        .attr("class", "time-axis2")
        .attr("transform", "translate(150, 200)")
        .call(timeAxis2);
  
    var gc = svg.append("g")
        .attr("class", "time-axis")
        .attr("transform", "translate(150, 120)")
        .call(timeAxis);
  
    brusher = svg.append("g")
        .call(brush)
        .call(brush.move, [x(2000), x(1500)]);
});

d3.select("#dropdown").on("change", function(d){
  console.log(d3.select(this).property("value"));
  forceBrush(d3.select(this).property("value"))
});

function updateNodes(){
    svg.selectAll("circle.begin")
      .attr("cx", function(){return x(d3.select(this).attr("begin"))+150;});
  
    svg.selectAll(".connectors")
      .attr("x1", function(){return x(d3.select(this).attr("begin"))+150;})
      .attr("x2", function(){return x(d3.select(this).attr("end"))+150;});
          
    svg.selectAll("circle.end")
      .attr("cx", function(){return x(d3.select(this).attr("end"))+150;});
  
    svg.selectAll(".labels")
      .attr("x", function(){return x(d3.select(this).attr("begin") - (d3.select(this).attr("duration")/2))+150;});
}

function forceBrush(dynasty){
  if(dynasty == "none"){
    brusher.transition().duration(500).call(brush.move, [x2(2000)+150, x2(1500)+150]);
  } else {
    d3.csv("durations.csv").then(function(data){
      data.forEach(function(d){
        if(d.Dynasty == dynasty){
          brusher.transition().duration(500).call(brush.move, [x2(d.begin)+150, x2(d.end)+150]);
        }
      })
    });
  }
  x.domain([x2.invert(d3.event.selection[0] - 150), x2.invert(d3.event.selection[1] - 150)]);
  svg.select(".time-axis").call(timeAxis);
  
  updateNodes();
}

function brushed(d){ 
  x.domain([x2.invert(d3.event.selection[0] - 150), x2.invert(d3.event.selection[1] - 150)]);
  svg.select(".time-axis").call(timeAxis);
  
  updateNodes();
}