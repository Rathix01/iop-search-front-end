angular.module('iopTvGuide').directive('searchinput', [ 'search-term', function ( searchTerm ) {

    return {
        restrict: 'E',
        scope: false,
        replace: true,
        template: "<div class='search-input-group'>" +
                    "<i class='icon icon-iop-search'></i>" +
                    "<input ng-model='searchValue' class='search-input-field' type='text' ng-change='autoComplete()' ng-keydown='search( $event )' placeholder='Search...' />" +
                    "<button class='clear-button' ng-click='clearSearch()'> clear </button>" +
                  "</div>",
        link: function ( $scope, $element, $attrs ) {

            $scope.autoComplete = function() {
                searchTerm.autoComplete.push( $scope.searchValue )
            }

            $scope.search = function( $event ) {

                if( $event.which === 13 ) {
                    $scope.autoCompleteData = [];
                    $scope.$broadcast( 'restore-index' )
                    searchTerm.search.push( $scope.searchValue )
                }

                if( $event.which === 40 ) {
                    $scope.$broadcast( 'key-press-down', $scope.autoCompleteData )
                }

                if( $event.which === 38 ) {
                    $scope.$broadcast( 'key-press-up', $scope.autoCompleteData )
                }
            }

            $scope.setValue = function ( $event, term ) {
                $scope.searchValue = term;
                searchTerm.search.push( $scope.searchValue )
            }

            $scope.setValueWithMouse = function ( $event, term ) {
                $scope.autoCompleteData = [];
                $scope.searchValue = term;
                searchTerm.search.push( $scope.searchValue )
            }

            $scope.clearSearch = function() {

                $scope.searchValue = "";
                searchTerm.autoComplete.push( "" )
            }

            $scope.$on( 'selected-value', $scope.setValue )
            $scope.$on( 'mouse-selected-value', $scope.setValueWithMouse )

            if( $attrs.currentsearchterm ) {
                $scope.setValue( null, $attrs.currentsearchterm );
            }
        }
    }
}]);

angular.module('iopTvGuide').directive('autocomplete', [ '$timeout', function ( $timeout ) {

    return {
        restrict: 'E',
        scope: true,
        replace: true,
        template: "<div class='autoCompleteData {{ isVisible() }}' >" +
                    "<div ng-repeat='data in autoCompleteData' class='auto-complete-row {{ isActive($index) }}' ng-click='selectWithMouse($index, data)'><span>{{ data.title }}</span></div>" +
                  "</div>",
        link: function ( $scope, $element, $attrs ) {

            $scope.selectedIndex = -1;
            $scope.selectedData = null;

            $scope.isVisible = function() {
                return ( $scope.autoCompleteData === undefined || $scope.autoCompleteData.length < 3 ) ? "ac-hide" : "ac-show"
            }

            $scope.restoreIndex = function() {
                $scope.selectedIndex = -1;
            }

            $scope.select = function( index, data ) {
                $scope.selectedIndex = index;
                $scope.selectedData = data;
                $scope.$emit( 'selected-value', data.title );
            }

            $scope.selectWithMouse = function ( index, data ) {
                $scope.selectedIndex = index;
                $scope.selectedData = data;
                $scope.$emit( 'mouse-selected-value', data.title );
                $timeout( $scope.restoreIndex, 10 );
            }

            $scope.isActive = function( index ) {
                return $scope.selectedIndex === index ? "is-active" : "is-not-active";
            }

            var moveDown = function ( $event, data ) {
                $scope.selectedIndex += 1;
                $scope.select( $scope.selectedIndex, data[ $scope.selectedIndex ] )
            }

            var moveUp = function ( $event, data ) {
                $scope.selectedIndex -= 1;
                $scope.select( $scope.selectedIndex, data[ $scope.selectedIndex ] )
            }

            $scope.$on( 'key-press-down', moveDown )
            $scope.$on( 'key-press-up', moveUp )
            $scope.$on( 'restore-index', $scope.restoreIndex )
        }
    }
}]);

angular.module('iopTvGuide').directive('searchresults', [function () {

    return {
        restrict: 'E',
        scope: false,
        replace: true,
        template: "<div class='search-results'>" +
                    "<detailpanel ng-repeat='eventData in searchData'></detailpanel>" +
                    //"<div ng-repeat='data in searchData'>{{ data.title }}</div>" +
                  "</div>",
        link: function ( $scope, $element, $attrs ) {
            
        }
    }
}]);

angular.module('iopTvGuide').directive('filters', [ 'filter-data', function ( filterData ) {

    return {
        restrict: 'E',
        scope: true,
        replace: true,
        template: "<div class='filter-list'>" +
                    "<div class='filter-item {{ allIsActive( data ) }}' ng-click='clickAll()'>ALL</div>" +
                    "<div class='filter-item {{ isActive( data ) }}' ng-repeat='data in filterData' ng-click='toggleFilter( data )'>{{ data }}</div>" +
                  "</div>",
        link: function ( $scope, $element, $attrs ) {
            
            var activeFilters = [];

            var setFilters = function( data ) {
                if(_.contains( activeFilters, data ) )  {
                    activeFilters = _.filter( activeFilters, function( ex ) { return ex !== data  } )
                } else {
                    activeFilters = activeFilters.concat( data );
                }
            }

            $scope.toggleFilter = function( data ) {
                filterData.input.push( data );
                setFilters( data )
            }

            $scope.clickAll = function() {
                filterData.input.push( [] );
                activeFilters = [];
            }

            $scope.isActive = function( data ) {
                return _.contains( activeFilters, data ) ? "isActive" : "isNotActive";
            }

            $scope.allIsActive = function() {
                return activeFilters.length === 0 ? "isActive" : "isNotActive";
            }
        }
    }
}]);