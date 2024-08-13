var siteWidth = 1280;
var scale = screen.width /siteWidth;

$(document).ready(function(){

    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');

});