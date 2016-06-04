var eventToUse = 'tap';
$(document).ready(function() {
  makeTemplates();

  bind('.navLogo',function(){
    console.log("heloeln");
    $('.navTabContainer').toggleClass('showNavOption');

  })
});
