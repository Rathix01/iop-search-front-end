angular.module('iopTvGuide').factory( 'filter-data', [ function() { 

	function setFilters( existing, newFilter ) {

		if( newFilter.length === 0 ) return [];

		if( _.contains( existing, newFilter ) ) {
			return _.filter( existing, function( ex ) { return ex !== newFilter  } )
		} else {
			return existing.concat( newFilter );
		}
	}

	var input = new Bacon.Bus();
	var value = input.scan([], setFilters);

    return {
    	input: input,
    	value: value,
    }

} ] );