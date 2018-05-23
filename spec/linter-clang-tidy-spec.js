'use babel';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('LinterClangTidy', () => {
    const { lint } = require('../lib/linter-clang-tidy.js').provideLinter();
    beforeEach( () => {
        waitsForPromise( () => {
            atom.packages.activatePackage('language-c');
            atom.packages.activatePackage('linter-clang-tidy');
            atom.config.set('linter-clang-tidy.timeout', 60);
            atom.config.set('linter-clang-tidy.options', '-checks=*');
            atom.config.set('linter-clang-tidy.execPath', 'clang-tidy-6.0');
            return atom.packages.activatePackage('linter-clang-tidy');
        });
    });


    it('is in the package list', () =>
        expect(atom.packages.isPackageLoaded('linter-clang-tidy')).toBe(true));

    it('is active', () =>
        expect(atom.packages.isPackageActive('linter-clang-tidy')).toBe(true));

    it('checks bad.cpp', () => {
        waitsForPromise(() => {
            filename = __dirname + '/files/bad.cpp';
            return atom.workspace.open(filename).then(editor => {
                return lint(editor).then(messages => {
                    expect(messages.length).toBe(5);
                });
            });
        });
    });

    it('checks good.cpp', () => {
        waitsForPromise(() => {
            filename = __dirname + '/files/good.cpp';
            return atom.workspace.open(filename).then(editor => {
                return lint(editor).then(messages => {
                    expect(messages.length).toBe(0);
                });
            });
        });
    });

});
