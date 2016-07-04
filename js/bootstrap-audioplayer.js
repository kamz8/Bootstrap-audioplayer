/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global el */

(function($){
    $.fn.audioPlayer = function(options) {
        options = $.extend({
            //...parametry
            coverSrc: 'images/img-default.jpg',            //Source to track cover image
            src: '',                                //link to audio file
            label: '',
            autoplay: false,
            widgedId: 'btn-player',
            sliderGetValue: function() {}
            
            
        }, options);

        return this.each(function() {
            //...UI elements
            var $t = $(this); 
            var $play = $t.find('.play i');
            var $vloume = $t.find('#volume');
            var $slider = $t.find('.ui-slider');
            var $progress = $t.find('.ui-seekbar .ui-progress');
            var $sliderHandle = $slider.find('.ui-seekbar .ui-slider-handle');
            var $seekBar =  $slider.find('.ui-seekbar');
            var $cover = $t.find('.cover');
            var $label = $t.find('.ui-label');
            var $timer = $t.find('#timer');
            var $playTime = $timer.find('.playtime');
            var $trackTime = $timer.find('.tracktime');
            
            var $sliderValue = null;
            var $sliderWidth = $seekBar.width();
            
            //Audio elements
            var audio = $('audio')[0];      //main audio object
            //functions
            var sliderSetValue = function() {};
            var setCurrentTime = function () {};
            // UI elements function
            var playPauseAnimate = function() {
                $play.toggleClass('fa-play fa-pause');
                try{
                if(!audio.paused || audio.ended) audio.pause(); else audio.play();
            }
                catch (e){
                    setLabel('Audio not found.');
                    $play.toggleClass('fa-play');
                }
            }; 
            
            var volumeAnimate = function() {
                $vloume.toggleClass('fa-volume-up fa-volume-off');
                audio.muted = !audio.muted;
            }; 
            
            
            var moveHandle = function(e) {

                var offset = $(this).offset();
                var relativeX = (e.pageX - offset.left)-0.5;
                var diffX = (relativeX / $(this).width())*100 ;
                
                diffX = diffX.toFixed(2);
                sliderSetValue(diffX);    

                setCurrentTime(diffX);
                $slider.bind('mousemove', function (e) {
                    var offset = $seekBar.offset();
                    var relativeX = (e.pageX - offset.left)-0.5;
                    var diffX = (relativeX / $seekBar.width())*100 ;                    

                    diffX = diffX.toFixed(2);
                    sliderSetValue(diffX);    
                    setCurrentTime(diffX);
                }); 
                
            };
            
            var sliderUpdate = function (){
                sliderSetValue(((audio.currentTime / audio.duration)*100));
            };
            
            var setCover = function (){
                $cover.attr('src',options.coverSrc) ;
            };
            
            var setLabel = function (val){
                $label.html('<span>'+val+'</span>') ;
            };            
            
            var setSrc = function (val){
                audio.src = options.src;
                audio.load();
            };             
            
            //helpers functions
            var sliderSetValue = function(value) {
                if(value > 100) value = 100;
                else if(value < 0) value = 0;
                $sliderHandle.css('left', value + '%');
                $progress.css('width', value + '%'); 
                
                $sliderValue = value;
            };
            var sliderGetValue = function() {
                return $sliderValue;
            };
            
            var timeFormat = function(currTime)
            {
                    var minute =0;
                    var sec =0;

                    if(currTime<60) 
                    {	if(currTime<10) sec = "0"+ currTime;
                            else
                                    sec = currTime;
                    }
                            else {

                                    if(minute<10) minute = "0"+ minute;
                                    minute =parseInt( currTime / 60);

                                    sec = parseInt(currTime);
                                    sec = currTime;
                                    sec= currTime % 60;
                                    if(sec<10) sec = "0"+ sec;

                            }	
                            console.log(sec);
                            return  minute +":" +sec;
            }; 
            
                var getTrackTime = function (){

                   return timeFormat(parseInt(audio.duration));;                    
                };   
                
                var getPlayTime = function (){

                   return timeFormat(parseInt(audio.currentTime));;                    
                };      
                
                var setCurrentTime = function (diffX){
                    audio.currentTime = (diffX*audio.duration)/100;
                };
            
            //end
            //audio functions
                var setTrackTime = function (){
                    $trackTime.html('');
                    $trackTime.append(getTrackTime());
                                       
                };
                
                var setPlayTime = function (){
                    $playTime.text(getPlayTime());
                    console.log(getPlayTime());
                           
                };   
                
                var autoplay = function (){
                    if(options.autoplay === true) playPauseAnimate();
                };
            //
            //bind all events
            $play.bind('click', playPauseAnimate);
            $vloume.bind('click', volumeAnimate);
            $sliderHandle.bind('mousedown', moveHandle);
            $sliderHandle.bind('mouseup', function (e) {
                $slider.unbind('mousemove');
                $sliderHandle.unbind('mousedown');
            });
            
            $seekBar.bind('mousedown', moveHandle);
            $sliderHandle.bind('mouseup', function (e) {
                $(document).unbind('mousedown');
            });
            
            audio.ontimeupdate = function () {
               setPlayTime(); 
               sliderUpdate();
               
            };
            
            audio.onerror = function () {
               setLabel('<i class="fa fa-error error"></i>'+'Nie załadowano audio'); 
            };

            //end events block
            
            sliderSetValue(0); 
            
            setCover();
            autoplay(); 
            setLabel(options.label);
            setSrc();
            setTrackTime();
        });
    };
})(jQuery);