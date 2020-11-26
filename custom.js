jQuery(document).ready(function($){

    var projectsContainer = $('.cd-projects-container'),
        projectsPreviewWrapper = projectsContainer.find('.cd-projects-previews'),
        projectPreviews = projectsPreviewWrapper.children('li'),
        projects = projectsContainer.find('.cd-projects'),
        navigationTrigger = $('.cd-nav-trigger'),
        navigation = $('.cd-primary-nav'),
        transitionsNotSupported = ( $('.no-csstransitions').length > 0);

    var animating = false,
        numRandoms = projects.find('li').length,
        uniqueRandoms = [];

    projectsPreviewWrapper.on('click', 'a', function(event){
        event.preventDefault();
        if( animating == false ) {
            animating = true;
            navigationTrigger.add(projectsContainer).addClass('project-open');
            openProject($(this).parent('li'));

        }
    });

    navigationTrigger.on('click', function(event){
        event.preventDefault();

        if( animating == false ) {
            animating = true;
            if( navigationTrigger.hasClass('project-open') ) {
                navigationTrigger.add(projectsContainer).removeClass('project-open');
                closeProject();
            } else if( navigationTrigger.hasClass('nav-visible') ) {
                navigationTrigger.removeClass('nav-visible');
                navigation.removeClass('nav-clickable nav-visible');
                if(transitionsNotSupported) projectPreviews.removeClass('slide-out');
                else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
            } else {
                navigationTrigger.addClass('nav-visible');
                navigation.addClass('nav-visible');
                setTimeout(function(){ location.reload(); }, 5000);
                if(transitionsNotSupported) projectPreviews.addClass('slide-out');

                else slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, true);

            }
        }
        if(transitionsNotSupported) animating = false;

    });

    projectsContainer.on('click', '.scroll', function(){
        projectsContainer.animate({'scrollTop':$(window).height()}, 500);
    });

    projectPreviews.children('a').bgLoaded({
        afterLoaded : function(){
            showPreview(projectPreviews.eq(0));
        }
    });


    function showPreview(projectPreview) {
        if(projectPreview.length > 0 ) {
            setTimeout(function(){
                projectPreview.addClass('bg-loaded');
                showPreview(projectPreview.next());
            }, 150);
        }
    }

    function openProject(projectPreview) {
        var projectIndex = projectPreview.index();
        projects.children('li').eq(projectIndex).add(projectPreview).addClass('selected');

        if( transitionsNotSupported ) {
            projectPreviews.addClass('slide-out').removeClass('selected');
            projects.children('li').eq(projectIndex).addClass('content-visible');
            animating = false;
        } else {
            slideToggleProjects(projectPreviews, projectIndex, 0, true);
        }
    }

    function closeProject() {
        projects.find('.selected').removeClass('selected').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            $(this).removeClass('content-visible').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            slideToggleProjects(projectsPreviewWrapper.children('li'), -1, 0, false);
        });

        //if browser doesn't support CSS transitions...
        if( transitionsNotSupported ) {
            projectPreviews.removeClass('slide-out');
            projects.find('.content-visible').removeClass('content-visible');
            animating = false;
        }
    }

    function slideToggleProjects(projectsPreviewWrapper, projectIndex, index, bool) {
        if(index == 0 ) createArrayRandom();
        if( projectIndex != -1 && index == 0 ) index = 1;

        var randomProjectIndex = makeUniqueRandom();
        if( randomProjectIndex == projectIndex ) randomProjectIndex = makeUniqueRandom();

        if( index < numRandoms - 1 ) {
            projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool);
            setTimeout( function(){
                //animate next preview project
                slideToggleProjects(projectsPreviewWrapper, projectIndex, index + 1, bool);
            }, 150);
        } else if ( index == numRandoms - 1 ) {
            //this is the last project preview to be animated
            projectsPreviewWrapper.eq(randomProjectIndex).toggleClass('slide-out', bool).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                if( projectIndex != -1) {
                    projects.children('li.selected').addClass('content-visible');
                    projectsPreviewWrapper.eq(projectIndex).addClass('slide-out').removeClass('selected');
                } else if( navigation.hasClass('nav-visible') && bool ) {
                    navigation.addClass('nav-clickable');
                }
                projectsPreviewWrapper.eq(randomProjectIndex).off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                animating = false;
            });
        }
    }

    //http://stackoverflow.com/questions/19351759/javascript-random-number-out-of-5-no-repeat-until-all-have-been-used
    function makeUniqueRandom() {
        var index = Math.floor(Math.random() * uniqueRandoms.length);
        var val = uniqueRandoms[index];
        // now remove that value from the array
        uniqueRandoms.splice(index, 1);
        return val;
    }

    function createArrayRandom() {
        //reset array
        uniqueRandoms.length = 0;
        for (var i = 0; i < numRandoms; i++) {
            uniqueRandoms.push(i);
        }
    }

});

/*
* BG Loaded
* Copyright (c) 2014 Jonathan Catmull
* Licensed under the MIT license.
*/
(function($){
    $.fn.bgLoaded = function(custom) {
        var self = this;

        // Default plugin settings
        var defaults = {
            afterLoaded : function(){
                this.addClass('bg-loaded');

            }
        };

        // Merge default and user settings
        var settings = $.extend({}, defaults, custom);

        // Loop through element
        self.each(function(){
            var $this = $(this),
                bgImgs = $this.css('background-image').split(', ');
            $this.data('loaded-count',0);
            $.each( bgImgs, function(key, value){
                var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                $('<img/>').attr('src', img).load(function() {
                    $(this).remove(); // prevent memory leaks
                    $this.data('loaded-count',$this.data('loaded-count')+1);
                    if ($this.data('loaded-count') >= bgImgs.length) {
                        settings.afterLoaded.call($this);
                    }
                });
            });

        });



    };
})(jQuery);