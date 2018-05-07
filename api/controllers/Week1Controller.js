/**
 * Week1Controller
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


var fs = require('fs');
var uniqid = require('uniqid');
var getpix = require('get-pixels');
var ndArr = require('ndarray');
var PNG = require('pngjs').PNG;

module.exports = {
    index: function (req, res) {
        var imageBase64 = req.param('image').replace(/^data:image\/png;base64,/, "");
        var IntensityLevel = Math.sqrt(parseFloat(req.param('graylevel')));
        var BaseURL = sails.config.custom.baseUrl;
        let ImageName = './assets/images/' + uniqid() + '.png';

        fs.writeFile(ImageName, imageBase64, 'base64', function (err) {
            if (err) {
                return res.send({ status: 'err', error: err });
            }
            getpix(ImageName, undefined, function (PixelError, pixels) {
                if (PixelError) {
                    return res.send({ status: 'err', error: 'bad url', err: PixelError });
                }
                var image_ND = ndArr(pixels['data'], pixels['shape'], pixels['stride'], pixels['offset']);
                //return res.send(image_ND);
                for (var i = 0; i < image_ND.shape[0]; i++) {
                    for (var j = 0; j < image_ND.shape[1]; j++) {
                        var idx = (image_ND.shape[1] * i + j) << 2;
                        //image_ND.set(i, j, image_ND.data[idx]);
                        image_ND.data[idx] = image_ND.data[idx] / IntensityLevel;
                        image_ND.data[idx + 1] = image_ND.data[idx + 1] / IntensityLevel;
                        image_ND.data[idx + 2] = image_ND.data[idx + 2] / IntensityLevel;
                        // image_ND.data[idx + 1] =  image_ND.data[idx + 1] /IntensityLevel;
                    }
                }

                //return res.send(image_ND.data);
                var png = new PNG({
                    width: image_ND.shape[0],
                    height: image_ND.shape[1],
                    filterType: -1,
                    colorType: 0,
                });
                for (var y = 0; y < png.height; y++) {
                    for (var x = 0; x < png.width; x++) {
                        var idx = (png.width * y + x) << 2;
                        png.data[idx] = image_ND.data[idx];
                        png.data[idx + 1] = image_ND.data[idx]
                        png.data[idx + 2] = image_ND.data[idx]
                        png.data[idx + 3] = image_ND.data[idx + 3]
                    }
                }
                //return res.send(sails.helpers);
                var ImageName = uniqid() + '.png';
                var FinalImageURL = './assets/images/aftergrayLevel/' + ImageName;

                png.pack().pipe(fs.createWriteStream(FinalImageURL));
                (async () => {
                    var baseUrl = await sails.helpers.getBaseUrl();
                    return res.send({ status: 'success', data: { final_image_url: baseUrl + '/images/aftergrayLevel/' + ImageName } });

                })();

            });
        });
    }
};

