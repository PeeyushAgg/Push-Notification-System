var eventToUse = 'tap';

$(document).ready(function () {
   makeTemplates();

   $(function(){
       $(window).scroll(function(){
           if ( $(this).scrollTop() > 100)
               $('.header').addClass('bottom');

           else
              $('.header').removeClass('bottom');
       });
   });
   var data = JSLINQ(oliveData.menuPage)
	           .Where(function(item){
	           	return (item.option=='BREAKFAST');
	           }).items[0];
	           console.log(data);
    $.tmpl('homeScreenContent', oliveData.homeScreen).appendTo('.homeScreenContent');
    $.tmpl('aboutUsContent', oliveData.aboutUs).appendTo('.aboutUsContent');
    $.tmpl('fillerPageContent', oliveData.fillerPage).appendTo('.fillerPageContent');

	$.tmpl('options',oliveData.menuPage).appendTo('.options');
	$('.selectMenuFor:first').addClass('selected');
	$('.subOptions').html('');
	$.tmpl('subOptions',data).appendTo('.subOptions');

	$.tmpl('fillerPanelContent', oliveData.fillerPanel).appendTo('.fillerPanelContent');

	$.tmpl('reservationContent', oliveData.reservation).appendTo('.reservationContent');
	$.tmpl('moreAboutUsContent', oliveData.moreAboutUs).appendTo('.moreAboutUsContent');
	$.tmpl('contactUsContent',oliveData.contactUs).appendTo('.contactUsContent');
	$.tmpl('footerContent',oliveData.footer).appendTo('.footerContent');

	bind('.selectMenuFor', showSubOptions);
});

function showSubOptions() {
	var item = $(this).tmplItem().data;
	$('.selectMenuFor.selected').removeClass('selected');
	$(this).addClass('selected');
	$('.subOptions').html('');
	$.tmpl('subOptions', item).appendTo('.subOptions');
}
