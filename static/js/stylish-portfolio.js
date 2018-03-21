(function($) {
  "use strict"; // Start of use strict

  var days = [0,0,0,0,0,0,0];

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
      var opacity = $(divId).css("opacity");

      // revert selection
      if (days[j-1] == (i-1)) {
        days[j-1] = -1;

        // increase opacity
        opacity *= 2;
        $(divId).css("opacity", opacity);
      } else if (days[j-1] >= 0) {
        // clear old
        var oldDiv = "#div"+(days[j-1]+1)+"_"+j;
        var oldOpacity = $(oldDiv).css("opacity");
        oldOpacity *= 2;
        $(oldDiv).css("opacity", oldOpacity);

        // set days to be this value
        // subtract 1 so that it fits into the 0 index array pattern
        days[j-1] = i - 1

        // set new
        opacity /= 2;
        $(divId).css("opacity", opacity);
      } else {
        // set days to be this value
        days[j-1] = i - 1
        opacity /= 2;
        $(divId).css("opacity", opacity);
      }

      // send updated data to the server
      $.ajax({
        url: '/prayerUpdate',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        data: JSON.stringify({'days': days}),
        error: function(xhr, status, err) {
            console.error('/myprayers/', status, err.toString());
        }.bind(this)
      });
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


  // get personal user data
  $.ajax({
    url: '/myprayers/',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    type: 'GET',
    success: function(data) {
      console.log(data);
       days = data;
     }.bind(this),
     error: function(xhr, status, err) {
       console.error('/myprayers/', status, err.toString());
     }.bind(this)
  });


  // get data from server and update image properties
  var updateFromServer = function() {
      $.ajax({
        url: '/prayers/',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function(data) {
            for (var j = 0; j < data.length; j++) {
              for (var i = 0; i < data[j].length; i++) {
                var count = data[j][i];
                var divId = "#div"+(j+1)+"_" + (i+1);

                if (count > 0) {
                  var opacity = 1 / (1+count);
                  $(divId).css("opacity", opacity);
                } else {
                  $(divId).css("opacity", 1);
                }
              }
            }
        }.bind(this),
        error: function(xhr, status, err) {
            console.error('/prayers/', status, err.toString());
        }.bind(this)
    });
  }

  updateFromServer();
  // update once a minute
  setInterval(updateFromServer, 60000);

})(jQuery); // End of use strict
