var jsonFile = "../samples.json";
var readJson = d3.json(jsonFile);


function buildDropdown(){
    // i = 0
    readJson.then(function(bbData){
        console.log(bbData);
        names = bbData.names;
        names.forEach(function(name){
            i = 0
            d3.select("#selDataset").selectAll("option")
                .data(names)
                .enter()
                .append("option")
                .text(name => name)
                .attr("value", i=>i)
        });
    });
};

function optionChanged(value){
    subject = parseInt(value);
        demographicInfo(subject);
        buildBarchart(subject);
        buildBubbleChart(subject);
};

// age: 24
// bbtype: "I"
// ethnicity: "Caucasian"
// gender: "F
// id: 940
// location: "Beaufort/NC"
// wfreq: 2

function demographicInfo(subject){  
    readJson.then(function(bbData){    
        var metaData = bbData.metadata;

        for(i=0; i < metaData.length; i++){
            var id = metaData[i]["id"];
            var demographics = Object.entries(metaData[i]);
            
            if (subject === id){
                var demInfo = d3.select("#sample-metadata").selectAll("p");
                demInfo.remove();

                demographics.forEach(function(array){
                    d3.select("#sample-metadata").selectAll("div")
                        .data([array])
                        .enter()
                        .append("p")
                        .html(`<strong>${array[0]}</strong>: ${array[1]}`)
                });
            };
        };
    });
};
    
function buildBarchart(){

};

function buildBubbleChart(){

};

buildDropdown();




