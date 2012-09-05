var crudo = require('./lib/crudo');

var o = {
	name:{type: String, validator:[], default:'grant'}, 
	sex:{ type: Array, validator:[], default:'Male'}, 
	age:{ type: Number, validator:[], default:'19'},
	other:{ type: Object, validator:[] },
	_title_:"This an object tile", 
	_description_:"Object has a cool definition too",
	_path_:'/'
};

crudo(o,{});