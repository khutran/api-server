$(document).ready(function() {
    $('.menu ul li').click(function() {
        $('.menu ul').find('.active').removeClass("active");
        $(this).addClass("active");
    });
    $('.users ul li span').click(function(event) {

        $(this).parent().parent().find('li').removeClass("current");
        // $(this).parent().find('.action').hide();
        // event.preventDefault();
        $(this).parent().find('.action').slideToggle(100);
        $(this).parent().find('.action').parent().addClass("current");
        $(this).parent().parent().find('li.current').siblings().children('.action').hide();
    });
    $('.projects ul li').click(function() {
        $(this).find('.project-active').removeClass("project-active");
        $(this).find('span').addClass("project-active");
    });
    $('.list-project ul li span').click(function() {
        $(this).parent().parent().find('li').removeClass("current");
        // $(this).parent().parent().find('li .action').hide();
        $(this).parent().find('.action').toggle(100);
        $(this).parent().find('.action').parent().addClass("current");
        $(this).parent().parent().find('li.current').siblings().children('.action').hide();
    });
});