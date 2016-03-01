/* global jQuery, skel */
/**
 * Old "main.js" from template inserted in a directive in order to run after template dom is ready.
 */
(function () {

  function TemplateDirective() {

    var templateDeps = function () {
      (function ($, skel) {

        skel.breakpoints({
          xlarge: '(max-width: 1680px)',
          large: '(max-width: 1280px)',
          medium: '(max-width: 980px)',
          small: '(max-width: 736px)',
          xsmall: '(max-width: 480px)'
        });

        $(function () {

          $('.menu').hide();

          var $window = $(window),
            $body = $('body'),
            $menu = $('#menu'),
            $sidebar = $('#sidebar'),
            $main = $('#main');

          // Disable animations/transitions until the page has loaded.
          $body.addClass('is-loading');

          $window.on('load', function () {
            window.setTimeout(function () {
              $body.removeClass('is-loading');
            }, 100);
          });

          // Fix: Placeholder polyfill.
          $('form').placeholder();

          // Prioritize "important" elements on medium.
          skel.on('+medium -medium', function () {
            $.prioritize(
              '.important\\28 medium\\29',
              skel.breakpoint('medium').active
              );
          });

          // IE<=9: Reverse order of main and sidebar.
          if (skel.vars.IEVersion <= 9)
            $main.insertAfter($sidebar);

          // Menu.
          $menu
            .appendTo($body)
            .panel({
              delay: 500,
              hideOnClick: true,
              hideOnSwipe: true,
              resetScroll: true,
              resetForms: true,
              side: 'right',
              target: $body,
              visibleClass: 'is-menu-visible'
            });

          // Search (header).
          var $search = $('#search'),
            $search_input = $search.find('input');

          $body
            .on('click', '[href="#search"]', function (event) {
              event.preventDefault();

              // Not visible?
              if (!$search.hasClass('visible')) {
                // Reset form.
                $search[0].reset();
                // Show.
                $search.addClass('visible');
                // Focus input.
                $search_input.focus();
              }
            });

          $search_input
            .on('keydown', function (event) {
              if (event.keyCode == 27)
                $search_input.blur();
            })
            .on('blur', function () {
              window.setTimeout(function () {
                $search.removeClass('visible');
              }, 100);
            });

          // Intro.
          var $intro = $('#intro');

          // Move to main on <=large, back to sidebar on >large.
          skel
            .on('+large', function () {
              $intro.prependTo($main);
            })
            .on('-large', function () {
              $intro.prependTo($sidebar);
            })
            .on('+medium', function() {
              $('.menu').show()
            })
            .on('-medium', function() {
              $('.menu').hide()
            });
            
        });

      })(jQuery, skel);
    };

    return {
      restrict: 'E',
      link: templateDeps
    };
  }

  angular.module('rafaelgil.blog')
    .directive('templateDeps', TemplateDirective);
} ());
