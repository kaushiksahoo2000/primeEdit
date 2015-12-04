/**
 * Chooser (Drop Box)
 * https://www.dropbox.com/developers/dropins/chooser/js
 */
options = {
    success: function(files) {
      files.forEach(function(file) {
        add_img_to_list(file);
      });
    },
    cancel: function() {
      //optional
    },
    linkType: "preview", // "preview" or "direct"
    multiselect: true, // true or false
    extensions: ['.png', '.jpg'],
};

// var button = Dropbox.createChooseButton(options);
// document.getElementById("dropbox-container").appendChild(button);

// function add_img_to_list(file) {
//   var li  = document.createElement('li');
//   var a   = document.createElement('a');
//   a.href = file.link;
//   var img = new Image();
//   var src = file.thumbnailLink;
//   src = src.replace("bounding_box=75", "bounding_box=256");
//   src = src.replace("mode=fit", "mode=crop");
//   img.src = src;
//   img.className = "th"
//   document.getElementById("img_list").appendChild(li).appendChild(a).appendChild(img);
// }



var selector = document.getElementById("selector");
selector.addEventListener("change", handleFiles, false);

function handleFiles() {
 var file = this.files[0];
 
 var ctx = document.getElementById('canvas').getContext('2d');

 var img = new Image;
 img.onload = function() {
    var ratio = img.width/img.height;
    var x = 600;
    var y = Math.floor(600*ratio);
    canvas.width = y;
    canvas.height = x;
    ctx.drawImage(img, 0, 0, y, x);
   URL.revokeObjectURL(img.src);
 }
 img.src = URL.createObjectURL(file);
}


$(function() {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');



  /* Enable Cross Origin Image Editing */
  var img = new Image();
  img.crossOrigin = '';
  img.src = 'https://source.unsplash.com/category/nature/800x600';

  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }

  var $reset = $('#resetbtn');
  var $brightness = $('#brightnessbtn');
  var $noise = $('#noisebtn');
  var $sepia = $('#sepiabtn');
  var $contrast = $('#contrastbtn');
  var $color = $('#colorbtn');

  var $hdr = $('#hdrbtn');
  var $oldpaper = $('#oldpaperbtn');
  var $pleasant = $('#pleasantbtn');

  var $save = $('#savebtn');

  /* As soon as slider value changes call applyFilters */
  $('input[type=range]').change(applyFilters);

  function applyFilters() {
    var hue = parseInt($('#hue').val());
    var cntrst = parseInt($('#contrast').val());
    var vibr = parseInt($('#vibrance').val());
    var sep = parseInt($('#sepia').val());

    Caman('#canvas', img, function() {
      this.revert(false);
      this.hue(hue).contrast(cntrst).vibrance(vibr).sepia(sep).render();
    });
  }

  /* Creating custom filters */
  Caman.Filter.register("oldpaper", function() {
    this.pinhole();
    this.noise(10);
    this.orangePeel();
    this.render();
  });

  Caman.Filter.register("pleasant", function() {
    this.colorize(60, 105, 218, 10);
    this.contrast(10);
    this.sunrise();
    this.hazyDays();
    this.render();
  });

  $reset.on('click', function(e) {
    $('input[type=range]').val(0);
    Caman('#canvas', img, function() {
      this.revert(false);
      this.render();
    });
  });

  /* In built filters */
  $brightness.on('click', function(e) {
    Caman('#canvas', function() {
      this.brightness(30).render();
    });
  });

  $noise.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.noise(10).render();
    });
  });

  $contrast.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.contrast(10).render();
    });
  });

  $sepia.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.sepia(20).render();
    });
  });

  $color.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.colorize(60, 105, 218, 10).render();
    });
  });


  /* Calling multiple filters inside same function */
  $hdr.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.contrast(10);
      this.contrast(10);
      this.jarques();
      this.render();
    });
  });

  /* Custom filters that we created */
  $oldpaper.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.oldpaper();
      this.render();
    });
  });

  $pleasant.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.pleasant();
      this.render();
    });
  });

  /* You can also save it as a jpg image, extension need to be added later after saving image. */

  $save.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.render(function() {
        this.save('png');
      });
    });
  });
});

