var fs = require('fs');
const { connect } = require('http2');
var path = require('path');
var filename = process.argv[2];
var outdir = process.argv[3];


var only_filename = path.basename(filename);
var target_file = path.join(outdir,only_filename);

console.log("Processing " + filename + " ==> " + target_file);

var contents = fs.readFileSync(filename, 'utf8');

var tagStart = contents.indexOf("$$");
var spheader = contents.substring(0,tagStart).trim();
var tagEnd = contents.indexOf("$$", tagStart + 10);
var spbody = contents.substr(contents.indexOf("$$") + 2,tagEnd - tagStart - 2).trim();

var usings = spbody.match(/"@USING_(\w+)";/g);

for (let index = 0; index < usings.length; index++) {
    const using = usings[index];
    
    try {
        var snippet_name = using.replace("\"@USING_","").replace('";','') + ".snippet";
        var regexp = new RegExp(using,"g");
        var snippet = fs.readFileSync(path.join(".",snippet_name));
        spbody = spbody.replace(regexp,snippet);
    }
    catch(ex)
    {
        console.error(`Snippet ${snippet_name} invalid`);
    }
}

var newsp = spheader + "\n$$\n" + spbody + "\n$$;";

fs.writeFileSync(target_file, newsp);