bootstrapSlider
===============

Bootstrap responsive carousel

All what you need is html based on twitter-bootstrap grid with special elements ".next", ".prev" and ".slide":

```html
<div class="js-selector">
    <div class="next">next, please</div>
    <div class="prev">go back</div>
    <div class="any-container-for-overflow-hidden">
        <div class="row">
            <div class="slide">
                <div class="col-md-3 col-sm-4 col-xs-6">content</div>
                <div class="col-md-3 col-sm-4 col-xs-6">content</div>
                <div class="col-md-3 col-sm-4 col-xs-6">content</div>
                ...
                <div class="col-md-3 col-sm-4 col-xs-6">content</div>
            </div>
        </div>
    </div>
</div>
```
... and simple javascript part:
```javascript
$('.js-selector').bootstrapSlider();
```
Css-files not needed, except bootstrap.css. 

Default options:
===============
```javascript
{
speed : 150,                //speed of animation
offsetCount : 1,            //offset value
delay : false,              //auto-play delay value in sec
autoPlayStopOnHover : true  //stop on hover if auto-play is true,
hideNav : false,            //hide next and prev buttons
resize : true,              //real-time resizing items or only by refreshing page
loop : true,                //loop carousel
paginationUl : false        //ul-element using for pagination
unit : '%',                 //calculation in pc or px
easing : 'swing'            //type of animation
next : $('.next'),          //button "next"
prev : $('.prev'),          //button "prev"
slide : $('.slide'),        //element-wrapper "slide"
}
```
