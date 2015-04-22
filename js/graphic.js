var mobileThreshold = 300, //set to 500 for testing
    aspect_width = 16,
    tickNumber = 5,
    aspect_height = 16;

//standard margins
var margin = {
    top: 20,
    right: 10,
    bottom: 50,
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
        var width = $graphic.width() / 4;
        render(width);
        window.onresize = draw_graphic; //very important! the key to responsiveness
    }
}

function render(width) {

    //empty object for storing mobile dependent variables
    var mobile = {};
    //check for mobile
    function ifMobile (w) {
        if(w < mobileThreshold){
        }
        else{
        }
    } 
    //call mobile check
    ifMobile(width);
    //calculate height against container width
    var height = Math.ceil((width * aspect_height) / aspect_width) - margin.top - margin.bottom;

    // Subtract margins from width
    var width = width - margin.left - margin.right;

    console.log(width);
    
    var x = d3.scale.ordinal().
        rangeRoundBands([0, width], 0.2),

        y = d3.scale.linear().range([height, 0]);

    var format = d3.format("0.2%"); //formats to two decimal places

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(5, 0, 0);

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(tickNumber)
        .orient("left")
        .tickSize(5, 0, 0);

    //define gridlines
    var make_y_axis = function() { 
        return d3.svg.axis()
            .scale(y)
                .orient("right")
                .ticks(tickNumber)
            }

    // ATTACH THINGS//////

    d3.csv("city_facet.csv", helper, function(error, csvs){

        var data = d3.nest()
            .key(function(d){ return d.city; })
            .entries(csvs);

        // http://bl.ocks.org/phoebebright/raw/3176159/

        console.log(data);

        // Set domain and range
        // x domain is years
        x.domain([2010, 2011, 2012, 2013, 2014]);
        
        console.log(x.domain());

        // y domain for all graphs
        y.domain([0,340]);

        //tooltip
        var tip = d3.tip().attr("class", "d3-tip")
            .html(function(d){ return d.breaks; });
       
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

        svg.selectAll(".bars")
              .data(function(d) {return d.values})
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d){ 
                return x(d.year); })
              .attr("y", function(d){ return y(d.breaks);})
              .attr("height", function(d){ return (height - y(d.breaks)); })
              .attr("width", x.rangeBand())
              .attr("opacity", "0.8")
              .on("mouseover", tip.show)
              .on("mouseout", tip.hide);

        //attach x axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
     
        // x axis label
        // svg.append("text")
        //     .attr("class", "label")
        //     .attr("text-anchor", "middle")
        //     .attr("transform", "translate(" + width/2 + "," + (height + 40) + ")")
        //     .text("Fiscal Year");

        //attach y axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // City labels
        svg.append("text")
            .data(data)
            .attr("class", "label")
            .style("text-anchor", "middle")
            // .attr("transform", "rotate(-90)")
            .attr("y", -5)
            .attr("x", width/2)
            .text(function(d){ return d.key; });

        //attach grid
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_axis()
                // tickSize(inner, outer)
                .tickSize((width), 0) //grid lines are actually ticks
                .tickFormat("")
            );

         svg.call(tip);

        } //end inner function

    )// end d3.csv

    var helper = function(d){
        d.year = +d.year;
        d.breaks = +d.breaks;
        return d;
    }
    

}//end function render    





