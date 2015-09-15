/**
 * @author Bilal Cinarli
 */

var expect = chai.expect;

describe('Testing UX Rocket Treelist', function() {
    describe('Properties', function() {
        it('should have version property', function() {
            expect($.uxrtreelist).to.have.property('version');
        });
    });
});