var YAML = require('yamljs');
var fs = require('fs');
var http = require('http');


var r = YAML.load('./submitvideo.yml');
var video = r.videos[r.current-1].url;
var cls = r.videos[r.current-1].class;

r.current += 1;
if (r.current > r.videos.length) {
  r.current = 1;
}
var timestamp = Date.now()/1000;
var url = r.curl+'&event.class='+cls+'&event.url='+video+'&event.timestamp='+timestamp;
http.get(url, (res) => {
  console.log('Status code: ',res.statusCode);
});
var s = YAML.stringify(r);
fs.writeFile('./submitvideo.yml', s, 'utf8', (err) =>{
  if (err) throw(err);
  console.log('Config updated');
});
