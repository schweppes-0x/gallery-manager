var fs = require("fs");
var chokidar = require("chokidar");

var baseDir = `/volume1/Tony/Gallery/${new Date().getFullYear()}`;
var tempFolder = `${baseDir}/temp`;

var picturesPath = `${baseDir}/Pictures`;
var videosPath = `${baseDir}/Videos`;

var pics_folder_monitor = chokidar.watch(tempFolder, {
  ignored: /^\./,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: true,
});

pics_folder_monitor.on("add", function (path) {
  const filename = path.replace(`${tempFolder}/`, "");
  const reg = /DCIM_[0-9]+APPLE_|DCIM_[0-9]+IMPRT_INCOMING-/;

  if (!reg.test(filename)) return;

  const imageRegex = /(.JPG|.JPEG|.PNG|.HEIC)/;
  const renamed = filename.replace(reg, "");

  var destination = imageRegex.test(filename.toUpperCase())
    ? `${picturesPath}/${renamed}`
    : `${videosPath}/${renamed}`;

  fs.rename(path, destination, (err) => {});
  var changesDateFolder =
    "/volume1/Tony/Gallery/" +
    new Date().toISOString().slice(0, 4) +
    "/" +
    new Date().toISOString().slice(5, 10);
  if (!fs.existsSync(changesDateFolder)) {
    fs.mkdirSync(changesDateFolder);
  }
});
