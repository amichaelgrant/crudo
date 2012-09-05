var should = require('should');
var crudo = require('../lib/crudo');
var o = {
	name:{type: String}, 
	sex:{ type: Array}, 
	age:{ type: Number},
	_title_:"This an object tile", 
	_description_:"Object has a cool definition too",
	_path_:'/'
};

describe('crudo', function() {
    describe('with  arguments', function() {
        it('returns an empty object', function() {
            var result = crudo(o);
            result.should.eql({});
        });
    });
});
