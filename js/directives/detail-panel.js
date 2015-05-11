angular.module('iopTvGuide').directive('detailpanel', [ "$rootScope", "$compile", function ( $rootScope, $compile ) {
    return {
        restrict: 'E',
        scope: true,
        template: "<div class='field-container detail-node'>" +
                      "<div class='detail-image'></div>" +
                      "<div class='detail-text'>" +
                          "<h2>{{ eventData.title }}{{ getRating( eventData ) }}</h2>" +
                          "<div class='detail-summary'>{{ eventData.dayString }} | {{ eventData.startAt }} - {{ eventData.endAt }} | {{ eventData.viewProperties.channelName }} | CHANNEL {{ eventData.channel }} </div>" +
                          "<div class='detail-synopsis'>{{ eventData.synopsis }}</div>" +
                          "<div class='icons'>" +
                            "<span class='icon icon-iop-reminder'></span>" +
                            "<span class='icon icon-iop-record'></span>" +
                            "<span class='icon icon-iop-share'></span>" +
                          "</div>" +
                      "</div>" +
                      "<div class='background-strip'></div>" +
                  "</div>",
        link: function ( $scope, $element, $attrs ) {

            console.log( $scope.eventData )

            var position = 0;

            $element = $($element[0]);

            $scope.getDayFromDate = function( event ) {
                
                console.log( "XX>", event )

                return ""
            }

            $scope.getRating = function ( eventData ) {
              return eventData && eventData.rating && eventData.rating.length > 0 ? "(" + eventData.rating + ")" : "";
            }

            var assignData = function ( eventData ) {
              $scope.eventData = eventData;
            }

            var reposition = function ( $event, eventData ) {

              if( !$scope.$$phase ) {
                $scope.$apply( assignData.bind( this, eventData ) );
              } else {
                assignData( eventData );
              }

              var modifier = eventData.single ? 40 : 75
              position = $( eventData.element ).offset().top;
              $element.css("transform", "translate3d(0px, " + ( position + modifier )  + "px, 0px)")
                      .css( "opacity", 0 )
                      .show();
              
              setTimeout( animateIn, 5 );
            }

            var animateIn = function () {
              $element.css( "opacity", 1 );
            }

            var animateCloseDetail = function() {
                $element.css( "opacity", 0 )
                setTimeout( closeDetail, 400 );
            }

            var closeDetail = function() {
                $element.hide();
                $scope.$emit( "close-event-detail" );
            }

            $element.width( $(".clip-border").width() );

            $element.find('.close-detail').on( "mousedown", animateCloseDetail );
            $scope.$on( "open-event-detail", reposition );
            $scope.$on( 'hide-event-detail', closeDetail );
        }
    }
}]);