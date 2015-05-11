angular.module('iopTvGuide').factory( 'search-data', [ 'search-term', 'filter-data', 'server-data', function( searchTerm, filterData, serverData ) { 

	var combine = function( searchTerm, filters ) {
		return { searchTerm: searchTerm, filters: filters }
	}
	
	var searchTemplate = Bacon.when( [
		searchTerm.value,
		filterData.value.toProperty()
	], combine )
	
	var autoCompleteTemplate = Bacon.when( [
		searchTerm.autoComplete,
		filterData.value.toProperty()
	], combine )

	var search = searchTemplate.flatMap( serverData.makeRequest );
	var autoComplete = autoCompleteTemplate.flatMap( serverData.makeRequest );

    return {
    	search: search,
    	autoComplete: autoComplete
    }

} ] );