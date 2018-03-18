(function($) {
  "use strict"; // Start of use strict

  // Closes the sidebar menu
  $(".menu-toggle").click(function(e) {
    e.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
    $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
    $(this).toggleClass("active");
  });

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('#sidebar-wrapper .js-scroll-trigger').click(function() {
    $("#sidebar-wrapper").removeClass("active");
    $(".menu-toggle").removeClass("active");
    $(".menu-toggle > .fa-bars, .menu-toggle > .fa-times").toggleClass("fa-bars fa-times");
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });


  //////////////////////////////  Custom codez go here ///////////////////////////////

  var onClickFunction = function(i, j) {
    var divId = "#div"+i+"_" + j;
    return function(e) {
      console.log("onClickFunction ahppening");
      var opacity = $(divId).css("opacity");
      var color = $(divId).css("background-color");

      console.log(color);

      if (color == "rgb(50, 205, 50)") {
        opacity *= 2;
        $(divId).css("opacity", opacity);
        $(divId).css("background-color", "#333");
      } else {
        opacity /= 2;
        $(divId).css("opacity", opacity);
        // $(divId).css("background-color", "#32CD32");
        // $(divId).css("border-style", "solid");
        // $(divId).css("border-width", "3px");
        // $(divId).css("border-color", "#32CD32")
      }
    }
  }

  var generateRowElement = function(i) {
    var rowHTML = '<div class="row calendar-row">';

    for (var j = 1; j < 8; j++) {
      rowHTML += generateButtonElement(i, j);  
    }

    rowHTML += "</div>"

    $("#calendartable").append(rowHTML);
  }

  var getDayOfWeek = function(j) {
    switch (j) {
      case 1:
        return "Sunday";
      case 2:
        return "Monday";
      case 3:
        return "Tuesday";
      case 4:
        return "Wednesday";
      case 5:
        return "Thursday";
      case 6:
        return "Friday";
      case 7:
        return "Saturday";
    }
  }

  var getTime = function(i) {
    var hours = "";

    var hour = i;
    if (i <= 4) {
      hours = "12";
    } else if (i <= 52) {
      hours = 1 + parseInt((i - 5) / 4);
    } else {
      hours = 1 + parseInt((i - 53) / 4);
    }
    // hours = 1 + parseInt((i - 5) / 4);

    // if (i <= 48) {
    //   hours = 1 + parseInt((i - 1) / 4);
    //   // hours = 12 - parseInt(((i - 1) / 4))
    // } else {
    //   hours = 1 + parseInt((i - 49) / 4);
    // }

    var minutes = "00";

    if (i % 4 == 1) {
      minutes = "00";
    } else if (i % 4 == 2) {
      minutes = "15";
    } else if (i % 4 == 3) {
      minutes = "30";
    } else {
      minutes = "45";
    }

    return hours + ":"+minutes;
  }

  var getTimeOfDay = function(i) {
    var startTime = getTime(i);
    // TODO: figure out last time slot case
    var endTime = getTime(i+1);
  
    var time = "am";

    if (i >= 48) {
      time = "pm";
    } 
    if (i == 96) {
      time = "am";
    }

    return startTime + "-" + endTime + " " + time;
  }

  var generateButtonElement = function(i, j) {
    var buttonHTML = '<div id="div'+i+'_'+j+'"';
    buttonHTML += ' class="col calendar-square"';
    buttonHTML += ' data-toggle="tooltip"';
    buttonHTML += ' data-placement="top"';
    var dayOfWeek = getDayOfWeek(j);
    var timeOfDay = getTimeOfDay(i);

    buttonHTML += ' title="' + dayOfWeek + ': ' + timeOfDay + '">';
    buttonHTML += "</div>";
    return buttonHTML
  }

  // 15 minute time slots
  for (var i = 1; i < 97; i++) {
    generateRowElement(i);
  }

  // generate event listeners
  for (var i = 1; i < 97; i++) {
    for (var j = 1; j < 8; j++) {
      $("#div"+i+'_'+j).on('click', onClickFunction(i, j));
    }
  }

})(jQuery); // End of use strict

// Disable Google Maps scrolling
// See http://stackoverflow.com/a/25904582/1607849
// Disable scroll zooming and bind back the click event
var onMapMouseleaveHandler = function(event) {
  var that = $(this);
  that.on('click', onMapClickHandler);
  that.off('mouseleave', onMapMouseleaveHandler);
  that.find('iframe').css("pointer-events", "none");
}

var onMapClickHandler = function(event) {
  var that = $(this);
  // Disable the click handler until the user leaves the map area
  that.off('click', onMapClickHandler);
  // Enable scrolling zoom
  that.find('iframe').css("pointer-events", "auto");
  // Handle the mouse leave event
  that.on('mouseleave', onMapMouseleaveHandler);
}
// Enable map zooming with mouse scroll when the user clicks the map
$('.map').on('click', onMapClickHandler);
