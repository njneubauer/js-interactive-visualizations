var url = "https://njneubauer.github.io/js-interactive-visualizations/samples.json";
var readJson = d3.json(url);


function buildDropdown(){
    readJson.then(function(bbData){
        console.log(bbData);
        names = bbData.names;
        names.forEach(function(name){
            d3.select("#selDataset").selectAll("option")
                .data(names)
                .enter()
                .append("option")
                .text(name => name)
        });
    });
};

function demographicInfo(subjectIndex){
    readJson.then(function(bbData){
        var i = subjectIndex; 
        var metaData = bbData.metadata
        var demographics = Object.entries(metaData[i]);
        // Remove old info
        d3.select("#sample-metadata").selectAll("p").remove();
    
        demographics.forEach(function(array){
            d3.select("#sample-metadata").selectAll("div")
                .data([array])
                .enter()
                .append("p")
                .html(`<strong>${array[0]}</strong>: ${array[1]}`)
        });
    });
};    


function buildBarChart(xData, yData, Labels){
       var yData = yData.slice(0,10);
        
        var trace = {
            x: xData,
            y: yData,
            text: Labels,
            type: "bar",
            orientation: "h",
            transforms: [{
                type: "sort",
                target: "x",
                order: "ascending"
            }]
        };
        
        barData = [trace];

        var layout = {
            margin:{ t:"25"},
            height: "500",
            yaxis:{
                type:"category",
                tickprefix: "OTU ",
                showtickprefix: 'all'
            }
        };

    Plotly.newPlot("bar", barData, layout);
};

function buildBubbleChart(xData,yData,labels){
        var trace = {
            x: xData,
            y: yData,
            text: labels,
            mode: 'markers',
            marker:{
                size: yData,
                color: xData,
                colorscale: 'Earth'
            }
        };
        var layout = {
            margin:{ t:"25"},
            xaxis: { title: "OTU ID"}
        };
        var bubbleData = [trace];

        Plotly.newPlot("bubble", bubbleData, layout);
};

function dataPoints(subjectIndex){
    var i = subjectIndex;
    readJson.then(function(bbData){    
        var samplesData = bbData.samples;
        var sampleValues = samplesData[i];
        var otuIDs = sampleValues["otu_ids"];
        var samples = sampleValues["sample_values"];
        var otuLabels = sampleValues["otu_labels"];
    
        var hoverLabels = [];
        otuLabels.forEach(function(array){
            var br = array.replace(/;/gi,", <br> ");
            hoverLabels.push(br);
        });
        buildBarChart(samples, otuIDs, hoverLabels);
        buildBubbleChart(otuIDs, samples, hoverLabels);
    });
};

function subjectIdIndex(optionValue){
    readJson.then(function(bbData){
        var data = bbData.metadata;

        for(i=0; i < data.length; i++){
            var id = data[i]["id"];
            if (optionValue === id){
                var subjectIndex = i
                dataPoints(subjectIndex);
                demographicInfo(subjectIndex);
            }
        };
    });
};

function init(){
    readJson.then(function(bbData){    
        var firstSubject = parseInt(bbData.names[0]);
        subjectIdIndex(firstSubject);
    });
};

function optionChanged(value){
    var optionValue = parseInt(value);
    subjectIdIndex(optionValue)
};

buildDropdown();
init();