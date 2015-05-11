angular.module('iopTvGuide').factory( 'search-term', [ function() { 

	var search = new Bacon.Bus();
	var autoComplete = new Bacon.Bus();

    return {
    	search: search,
    	value: search,
    	autoComplete: autoComplete
    }

} ] );