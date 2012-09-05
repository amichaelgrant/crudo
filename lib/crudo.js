/*
* MVC CRUD manager for objects in node
*/
var CRUDO = {
	ELEMENTS: {
		TEXTFIELD: 0,
		TEXTAREA: 1,
		SELECT: 2,
		CHECKBOX:3,
		RADIO:4,
		BUTTON:5,
		FILE:6,
		HIDDEN:7
	},
	VALIDATORS: {
		ALPHA: function(){},
		ALPHANUMERIC: function(){},
		MIN: function(){},
		MAX: function(){},
		EMAIL: function(){},
		NUMBER: function(){},
		LEN: function(len){},
		CUSTOM: function(regex, comment){},
	},
	output: '',
	buildHeader: function(ftitle, fdescription){
		//build form title and description into form //
		//You know, in case humans are reading the form. :-)
		var o = '';
		o += '<div class="ctitle">';
		o += ftitle;
		o += '</div>';

		o += '<div class="cdescription">';
		o += fdescription;
		o += '</div>';

		this.output = o;
		return;
	},
	buildElement: function(field, ftype ,fdefault, fvalidator, fclass){
		var o = '';
		switch( ftype ){
			case this.ELEMENTS.TEXTFIELD:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<input type="text" name="'+field+'" class="' +fclass+ '" onblur="" />';
				o +='</div>';
				break;
			case this.ELEMENTS.TEXTAREA:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<textarea name="'+field+'" class="'+fclass+'" onblur=""></textarea>';
				o +='</div>';
				break;
			case this.ELEMENTS.SELECT:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<select name="'+field+'" class="'+fclass+'" onblur="">';
				//put default values in select list here//
				o +='<option value="0">' + 'Select One' + '</option>';
				o +='</select>';
				o +='</div>';
				break;
			case this.ELEMENTS.CHECKBOX:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<input type="checkbox" name="'+field+'" class="'+fclass+'" onblur="" />';
				o +='</div>';
				break;
			case this.ELEMENTS.RADIO:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<input type="radio" name="'+field+'" class="'+fclass+'" onblur="" />';
				o +='</div>';
				break;
			case this.ELEMENTS.BUTTON:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<button name="'+field+'" class="'+fclass+'" onblur="" />';
				o +='</div>';
				break;
			case this.ELEMENTS.FILE:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<input type="file" name="'+field+'" class="'+fclass+'" onblur="" />';
				o +='</div>';
				break;
			case this.ELEMENTS.HIDDEN:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<input type="hidden" name="'+field+'" class="'+fclass+'" onblur="" />';
				o +='</div>';
				break;
			default:
				o +='<div class="cgroup">';
				o +='<label class="clabel">' +field+ '</label>';
				o +='<textarea name="'+field+'" class="'+fclass+'" onblur=""></textarea>';
				o +='</div>';
		}

		//add to output buffer
		this.output += o;
		return;
	},
	buildForm: function(path){
		//wrap the form elements in a form tag//
		var o = '';
		o += '<form action="'+ path +'" method="post">';
		o = o + this.output;
		o += '<input type="submit" name="submit" value="Save" />';
		o += '</form>';
		this.output = o;
		return;
	},
	renderView: function(path){
		//render the view to the browser//
		//or to string 
		this.buildForm(path);
		return this.output;
	}
};


function crudo(oBject, oApplication){
	if(!oBject && 
		!(oBject instanceof Object) && 
		!oBject.hasOwnProperty ){
		console.log('Invalid object passed to crudo');
		throw new Error('Invalid object');
	}
	//process if valid object passed//
	
	//looping through for object properties//
	var ftitle = '';
	var fdescription = '';
	var fpath = '/';
	for( var field in oBject){
		console.log('field name is ->' + field + ' and value is ->' + oBject[field]);


		//fetch user defined title//
		if( field == '_title_'){
			ftitle = oBject[field];
		}
		//then the user defined description
		else if(field == '_description_'){
			fdescription = oBject[field];
		}
		//path for routing http calls
		else if(field == '_path_'){
			fpath = oBject[field];
		}
		//make sure you are only dealing with non-function members
		else if( oBject.hasOwnProperty(field) && typeof oBject[field] !== "function" ){
			//console.log('field name is ->' + field + ' and value is ->' + oBject[field]);

			//every field in object must have the following structure:
			/*{
				type:<any-primitive-javascript-type>,
				//validator:<regex-validator for custom validation>,
				validator: [validation-array],
				default:<any-of-the-primitive-types>,
				class:<name-of-class>

			} */

			var fieldDef = oBject[field];
			if(fieldDef instanceof Object && fieldDef.hasOwnProperty ){
				//Yes indeed the field definition is ok
				//we can go on and work on its values
				/*javascript primivite types:
					Object
					Array
					String
					Number
					Boolean
				*/
				var ftype = '';
				var fvalidators= [];
				var fdefault = '';
				var fclass = '';
				for( var fieldProperty in fieldDef){
					//process the type 
					if(fieldProperty.toLowerCase() === 'type'){

						switch( fieldDef[fieldProperty] ){
							case 'String': ftype = CRUDO.ELEMENTS.TEXTFIELD; break;
							case 'Number': ftype = CRUDO.ELEMENTS.TEXTFIELD; break;
							case 'Boolean': ftype = CRUDO.ELEMENTS.CHECKBOX; break;
							case 'Array': ftype = CRUDO.ELEMENTS.SELECT; break;
							default:
								ftype = CRUDO.ELEMENTS.TEXTAREA;
						}

					}else if(fieldProperty.toLowerCase() === 'validator'){
						var fval = fieldDef[fieldProperty];
						if( fval instanceof Array)
							fvalidators.concat( fval );
						else 
							fvalidators.push( fval );
					}else if(fieldProperty.toLowerCase() === 'default'){
						fdefault = fieldDef[fieldProperty];
					}else if(fieldProperty.toLowerCase() === 'class'){
						fclass = fieldDef[fieldProperty];
					}else{
						console.log(fieldProperty + ' -> is invalid fieldDefinition path');
						throw new Error(fieldProperty + ' -> is invalid fieldDefinition path');
					}
					
				}
				//assembled properties for view and controller generation
				CRUDO.buildElement( field, ftype ,fdefault, fvalidators, fclass);
			}
		}
	}
	//But before processing get object name and description
	CRUDO.buildHeader(ftitle, fdescription);
	console.log( CRUDO.renderView(fpath) );


	//controller logic

    var o = {};
    return o;
}

module.exports = crudo;