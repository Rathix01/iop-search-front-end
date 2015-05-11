angular.module('iopTvGuide').factory( 'server-data', [ '$http', function( $http ) { 

	var channels = IOP_DATA.programmeguide_WAR_programmeguideportlet_INSTANCE_Nrhb4LM36Ik5.channels

	var getByName = function( searchTerm, event ) {
		return event.title.toLowerCase().indexOf( searchTerm.toLowerCase() ) > -1
	}

	var getGenre = function ( dataItem ) {
		var channel = _.filter( channels, function ( c ) {  return c.number == dataItem.channel  } )
		return _.merge( dataItem, { filters: channel[0].genre } );
	}

	var withFilters = function ( data ) {
		return _.map( data, getGenre );
	}

	var searchData = function( searchTerm, events ) {
		return withFilters( _.filter( events, getByName.bind( this, searchTerm ) ) );
	}

	var getDayString = function( index ) {
		return [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday"
		][index];
	}

	var formatDate = function( time ) {

		var d = new Date( time );
		var hr = d.getHours();
		var mins = d.getMinutes();

		suffix = ( hr > 11 ) ? "PM" : "AM"
		hr = ( hr > 12 ) ? ( hr - 12 ) : hr;
		hr = hr === 0 ? 12 : hr;
		mins = mins.toString().length === 2 ? mins : mins + "0";

		return hr + ":" + mins + " " + suffix;
	}

	var formatEvent = function( event ) {

		if( event.date === undefined ) {

			event.start = ( parseInt( event.start + "000" ) );
   			event.end = ( parseInt( event.end + "000" ) );
	   		event.date = new Date( event.start ).setHours(0,0,0,0);
	  		event.startAt = formatDate( event.start );
	  		event.endAt = formatDate( event.end );
	  		event.dayString = getDayString( new Date( event.date ).getDay() )
		}

		return event;
	}

	var formatData = function( events ) {
		return _.map( events, formatEvent );
	}

	//use $http here to get data from server. current content is temp.
	var makeRequest = function( searchParams ) {

		if( searchParams.searchTerm === "" || searchParams.searchTerm.length < 3 ) return Bacon.once([]); 

		//temp code
		var d = $.Deferred();
		var events = formatData( IOP_DATA.programmeguide_WAR_programmeguideportlet_INSTANCE_Nrhb4LM36Ik5.events )
		
		// do "search"
		d.resolve( searchData( searchParams.searchTerm, events ) )
		return Bacon.fromPromise( d );
	}

    return {
    	makeRequest: makeRequest
    }

} ] );