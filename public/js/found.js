//<![CDATA[ 
$(window).load(function(){
var foundTop = $('.found').offset().top;
$(window).scroll(function () {
    var currentScroll = $(window).scrollTop();
    if (currentScroll >= 44) {
        $('.found').css({
            position: 'fixed',
            bottom: '0',
            left: '0'
        });
    } else {
        $('.found').css({
            bottom: '-44px',
        });
    }
});
});//]]>  


