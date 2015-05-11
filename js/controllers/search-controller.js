angular.module( "IOPApp", [ 'iopTvGuide' ] );

angular.module('IOPApp').controller( 'search-controller', [ '$scope', 'search-data', 'filter-results',
	function ( $scope, searchData, filterResults ) {

		// set the default term.
		$scope.searchTerm = ""
		$scope.searchData = [];
		$scope.filterData = [];

		function displaySearch( data ) {
			$scope.searchData = data;
		}

		function displayAutocomplete( data ) {
			$scope.autoCompleteData = data.slice( 0, 10 );
		}

		function displayFilters( data ) {
			$scope.filterData = data;
		}

		searchData.search.onValue( displaySearch )
		searchData.autoComplete.onValue( displayAutocomplete )
		filterResults.filters.onValue( displayFilters )
	}	
]);