angular.module('iopTvGuide').factory( 'filter-results', [ 'search-data', function( searchData ) { 

	var toGenre = function ( searchItem ) {
		return searchItem.filters;
	}

	var toFilterList = function ( searchData ) {
		return  _.uniq( _.flatten( _.map( searchData, toGenre ) ) );
	}

	var filters = searchData.search.map( toFilterList);

	return {
		filters: filters
	}

} ] );