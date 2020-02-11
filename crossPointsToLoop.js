var fs = require("fs")
var turf = require("@turf/turf")
var c = fs.readFileSync("comm.json")
var parsed = JSON.parse(c);
var commAreas = parsed.features;

var annotated = fs.readFileSync("annotatedCenters.csv","utf8").split("\n");
var nameToPoint = {};
var pointToName = {}
for (var i = 0; i < annotated.length; i++) {
    cats = annotated[i].split(",");
    nameToPoint[cats[2]] = [cats[0],cats[1]];
    pointToName[ [cats[0],cats[1]] ] = cats[2];
}
//console.log(pointToName);


var raw = fs.readFileSync("cross_points.csv","utf8").split("\n");
var c;
var res = "area,center_lng,center_lat,time\n";
// start at 1 to skip first row of CSV
for (var i = 1; i < raw.length; i++) {
    var cats = raw[i].split(",");
    if (cats.length < 2) continue;

    var dest_name = pointToName[ [cats[2],cats[3]]];
    var origin_name = pointToName[[cats[0],cats[1]]];
    if (dest_name == "LOOP") {
        console.log("from " + origin_name);
        res += origin_name + "," + cats[0] + "," + cats[1] + "," + cats[4] + "\n";
    }
    if (i%100==0) {
        console.log(i);
    };
}

fs.writeFile("centersToLoop.csv",res , (a,b) => {console.log("Done",a,b)});
