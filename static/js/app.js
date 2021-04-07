var jsonFile = "../samples.json";
var readJson = d3.json(jsonFile);


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
        var demInfo = d3.select("#sample-metadata").selectAll("p").remove();
    
        demographics.forEach(function(array){
            d3.select("#sample-metadata").selectAll("div")
                .data([array])
                .enter()
                .append("p")
                .html(`<strong>${array[0]}</strong>: ${array[1]}`)
        });
    });
};    

function buildBarchart(subjectIndex){
    var i = subjectIndex;
    readJson.then(function(bbData){    
         var samplesData = bbData.samples;
                var sampleValues = samplesData[i];
                var ydata = sampleValues["otu_ids"];
                var xdata = sampleValues["sample_values"];
                var hoverData = sampleValues["otu_labels"];
                ydata = ydata.slice(0,10);

                var trace = {
                    x: xdata,
                    y: ydata,
                    hoverinfo: hoverData,
                    type: "bar",
                    orientation: "h",
                    transforms: [{
                        type: "sort",
                        target: "x",
                        order: "ascending"
                    }]
                };
                
                barData = [trace]

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
    });
};

function buildBubbleChart(subjectIndex){
    var i = subjectIndex;
};

function subjectIdIndex(optionValue){
    readJson.then(function(bbData){
        var data = bbData.metadata;
        console.log(data)
        for(i=0; i < data.length; i++){
            var id = data[i]["id"];
            if (optionValue === id){
                var subjectIndex = i
                demographicInfo(subjectIndex);
                buildBarchart(subjectIndex);
                buildBubbleChart(subjectIndex);
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