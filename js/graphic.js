var mobileThreshold = 450, //set to 500 for testing
    aspect_width = 16,
    tickNumber = 5,
    aspect_height = 16;

//standard margins
var margin = {
    top: 15,
    right: 10,
    bottom: 30,
    left: 30
};

// Dummy data
var data = [
    {
        "year": "2010",
        "percent": 0.0053
    },
    {
        "year": "2011",
        "percent": 0.0055
    },
    {
        "year": "2012",
        "percent": 0.0068
    },
    {
        "year": "2013",
        "percent": 0.0082
    },
    {
        "year": "2014",
        "percent": 0.012
    }
];

//jquery shorthand
var $graphic = $('#graphic');
//base colors
var colors = {
    'red1': '#6C2315', 'red2': '#A23520', 'red3': '#D8472B', 'red4': '#E27560', 'red5': '#ECA395', 'red6': '#F5D1CA',
    'orange1': '#714616', 'orange2': '#AA6A21', 'orange3': '#E38D2C', 'orange4': '#EAAA61', 'orange5': '#F1C696', 'orange6': '#F8E2CA',
    'yellow1': '#77631B', 'yellow2': '#B39429', 'yellow3': '#EFC637', 'yellow4': '#F3D469', 'yellow5': '#F7E39B', 'yellow6': '#FBF1CD',
    'teal1': '#0B403F', 'teal2': '#11605E', 'teal3': '#17807E', 'teal4': '#51A09E', 'teal5': '#8BC0BF', 'teal6': '#C5DFDF',
    'blue1': '#28556F', 'blue2': '#3D7FA6', 'blue3': '#51AADE', 'blue4': '#7DBFE6', 'blue5': '#A8D5EF', 'blue6': '#D3EAF7'
};

/*
 * Render the graphic
 */
//check for svg
$(window).load(function() {
    draw_graphic();
});

function draw_graphic(){
    if (Modernizr.svg){
        $graphic.empty();
        // var width = 180;
        var container_width = $graphic.width();
        render(container_width);
        window.onresize = draw_graphic; //very important! the key to responsiveness
    }
}

function render(container_width) {

    //empty object for storing mobile dependent variables
    var mobile = {};
    var width;
    //check for mobile
    function ifMobile (w) {
        if(w < mobileThreshold){
            width = container_width /2;
        }
        else{
            width = container_width/4;
        }
    } 
    //call mobile check
    ifMobile(container_width);
    //calculate height against container width
    var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom;

    // Subtract margins from width
    var width = width - margin.left - margin.right;

    console.log("width = " + width);

    var x = d3.scale.ordinal().
        rangeRoundBands([0, width], 0.2),

        y = d3.scale.linear().range([height, 0]);

    var format = d3.format("0.2%"); //formats to two decimal places

    // year format for x ticks
    function year_abb(d){
        var num = d.toString();
        return num.substring(2,4)
    }

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(tickNumber)
        .orient("left")
        .tickSize(-width);
        // .tickSize(5, 0, 0);

    //define gridlines
    var make_y_axis = function() { 
        return d3.svg.axis()
            .scale(y)
            .orient("right")
            .ticks(tickNumber)
            }

    // ATTACH THINGS//////

    d3.csv("short_facet.csv", helper, function(error, csvs){

        var data = d3.nest()
            .key(function(d){ return d.city; })
            .entries(csvs);

        // http://bl.ocks.org/phoebebright/raw/3176159/

        // Set domain and range
        // x domain is years
        x.domain([2010, 2011, 2012, 2013, 2014]);

        // y domain for all graphs
        y.domain([0,340]);

        //tooltip
        var tip = d3.tip().attr("class", "d3-tip")
            .html(function(d){ return d.breaks + " breaks"; });
       
        // // raise up tip by 10px
        // tip.offset([-10, 0])

        //create svgs for each symbol
        var svg = d3.select("#graphic").selectAll("svg")
                .data(data)
            .enter().append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var bars = svg.selectAll(".bars")
              .data(function(d) {return d.values});

        bars.enter().append("rect")
              .attr("class", function(d,i){ return "bar bar-" + d.year; })
              .attr("x", function(d){ return x(d.year); })
              .attr("y", function(d){ return y(d.breaks); })
              .attr("height", function(d){ return (height - y(d.breaks)); })
              .attr("width", x.rangeBand())
              .attr("opacity", 1)
              .on("mouseover", mouseover)
              .on("mouseout", mouseout);

        // tooltip values
        bars.enter().append("text")
            .attr("x", function(d){ return x(d.year) + (x.rangeBand()/2); })
            .attr("text-anchor", "middle")
            .attr("y", function(d){ return y(d.breaks) - 10; })
            .attr("dy", ".35em")
            .attr("class", function(d){ return "bartip bartip-" + d.year; })
            .attr("opacity", 0.0)
            .text(function(d){ return d.breaks; });
 
        function mouseover(d,i){
            // show tip for this bar
            // tip.show(d);
            console.log(x.rangeBand());
            // highlight all the others
            svg.selectAll(".bar-" + d.year)
                .transition()
                .duration(100)
                .attr("opacity", 0.5);

            svg.selectAll(".bartip-" + d.year)
                .transition()
                .duration(100)
                .attr("opacity", 1.0);
        }

        function mouseout(d,i){
            // tip.hide(d);

            svg.selectAll(".bar-" + d.year)
                .transition()
                .duration(100)
                .attr("opacity", 1.0);

            svg.selectAll(".bartip-" + d.year)
                .transition()
                .duration(100)
                .attr("opacity", 0.0);
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickFormat(function(d,i){
                return '\u2019' + year_abb(d);
            })
            .tickSize(5, 0, 0);

        //attach x axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //attach y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // City labels
        svg.append("text")
            .data(data)
            .attr("class", "label")
            .style("text-anchor", "middle")
            .attr("y", -5)
            .attr("x", width/2)
            .text(function(d){ return d.key; });

         svg.call(tip);

        } //end inner function

    )// end d3.csv

    var helper = function(d){
        d.year = +d.year;
        d.breaks = +d.breaks;
        return d;
    }
    

}//end function render    





