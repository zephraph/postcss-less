import stringify from '../lib/less-stringify';
import parse     from '../lib/less-parse';

import { expect } from 'chai';
import   cases    from 'postcss-parser-tests';

describe('stringify', () => {

    cases.each( (name, css) => {
        if ( name === 'bom.css' ) return;

        it('stringifies ' + name, () => {
            let root   = parse(css);
            let result = '';
            stringify(root, i => result += i );
            expect(result).to.eql(css);
        });
    });

    it('stringifies inline comment', () => {
        let root   = parse('// comment\na {}');
        let result = '';
        stringify(root, i => result += i );
        expect(result).to.eql('// comment\na {}');
    });

    it('stringifies inline comment in the end of file', () => {
        let root   = parse('// comment');
        let result = '';
        stringify(root, i => result += i );
        expect(result).to.eql('// comment');
    });

});
