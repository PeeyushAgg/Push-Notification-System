var eventToUse = 'tap';
$(document).ready(function() {
    makeTemplates();

    var today = new Date();
    var date = moment(today);
    var currentDate = date.format("Do MMMM dddd");
	  $(document).on("scroll", onScroll);
    scrollByMenu();
    $('.dateContainer').text(currentDate);

    var date = JSLINQ(calendar.data)
      .Where(function(x) {
        return (x.monthNumber == 'May');
      }).items[0];

    render(".datePanel", "calendar", date);
    render(".eventContainer", "event", calendar.data[1].dates[14]);

    $('.event:eq(0)').addClass('selected');

    bind('.btnBook', showConfirmationContainer);
    bind('.month', showMonth);
    bind('.event', showEvent);
    $('.widgetNew').mouseenter(function(){
        $(this).css('width','13rem');
        $(this).find('.text').removeClass('hide');

    })
    $('.widgetNew').mouseleave(function(){
        $(this).css('width','4rem');
        $(this).find('.text').addClass('hide');
    })

    bind(".btnSubscribe", function(){
        $('.popUpWindow').removeClass('hide');
        bind('.closeIcon',function(){
            $('.popUpWindow').addClass('hide');
        })
    });
    var gcm_key = {};


});

function onScroll(event){
	if ( $(this).scrollTop() > 100){
	console.log('hi');
		$('.navBar').fadeIn('slow');
	}
	else{
		$('.navBar').fadeOut('slow');
	}
    var scrollPos = $(document).scrollTop();
    $('.link').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("data-link"));
        console.log(refElement.position().top)
        if (refElement.position().top-100 <= scrollPos && refElement.position().top + refElement.height()-50 > scrollPos) {
            currLink.addClass("color");
        }
        else{
            currLink.removeClass("color");
        }
    });
}
function scrollByMenu(){
  $( '.link').on('click', function (e) {
      e.preventDefault();
      $(document).off("scroll");

      $('.link').each(function () {
          $(this).removeClass('color');
      })
      $(this).addClass('color');

      var target = $(this).attr('data-link'),

      menu = target;
      $target = $(target);
      $('html, body').stop().animate({
          'scrollTop': $target.offset().top+2
      }, 500, 'swing', function () {
          window.location.hash = target;
          $(document).on("scroll", onScroll);
      });
          $('.navTabContainer').removeClass('showNavOption');
  });
}



function showMonth() {
  console.log("lucifer morning star");
  $('.month').removeClass('active');
  $(this).addClass('active');

  var monthType = $(this).attr("month-type");
  console.log(monthType);
  var date = JSLINQ(calendar.data)
    .Where(function(x) {
      return (x.monthNumber == monthType)
    }).items[0];

  render(".datePanel", "calendar", date);

  bind('.event', showEvent);
  bind('.btnBook', showConfirmationContainer);
}

function showEvent() {
  var index = $(this).attr("event-index");
  $('.dateBlock').removeClass('selected');
  $(this).addClass('selected');
  var eventType = $(this).tmplItem().data;
  $('.confirmationContainer').removeClass('fadeIn');
  $('.btnBook').removeClass('rotate');
  $('.flipContainer').removeClass('hideBtn');

  render(".eventContainer", "event", eventType.dates[index]);
  bind('.btnBook', showConfirmationContainer);
}

function showConfirmationContainer() {
  $('.confirmationContainer').addClass('fadeIn');
  $('.btnBook').addClass('rotate');

  render('.personBarContainer', 'personBar', numberBlock.number)
  $('.numberBlock:eq(2)').addClass('selectedNumber');

  bind('.numberBlock', function showSelectedNumber() {
    $('.numberBlock').removeClass('selectedNumber');
    $(this).addClass('selectedNumber');
  });
  bind('.face.back', showThankYouContainer)
}

function showThankYouContainer() {
  if($('body').width() > 500){
  name = $('.placeholder.name').val();
  number = $('.placeholder.number').val();
}else{
  name = $('.placeholder.name.small').val();
  number = $('.placeholder.numbe.small').val();
}

  if (name != '' && number != '') {
    $('.thankYouContainer .name').text(name);
    $('.thankYouContainer').addClass('fadeIn');
    $('.flipContainer').addClass('hideBtn');
    $('.target').text('');
    setTimeout(function() {
      $('.confirmationContainer').removeClass('fadeIn');
      $('.thankYouContainer').removeClass('fadeIn');
      $('.btnBook').removeClass('rotate');
      $('.flipContainer').removeClass('hideBtn');
      $('.placeholder').val('');
    }, 1500);
  } else {
    $('.target').text('*Please fill in the all input fields');
  }
};
