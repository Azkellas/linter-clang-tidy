'use babel'
import { CompositeDisposable } from 'atom';


export function activate() {
    require('atom-package-deps').install('linter-clang-tidy')

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-clang-tidy.execPath',
        (value) => { this.execPath = value;}));

    this.subscriptions.add(atom.config.observe('linter-clang-tidy.options',
        (value) => { this.execPath = value;}));
}

export function deactivate() {
    this.subscriptions.dispose();
}

helpers = require('atom-linter');

export function provideLinter() {
    return {
        name: 'clang-tidy',
        scope: 'file',
        lintsOnChange: false,
        grammarScopes: ['source.js'],
        lint(textEditor) {
            const editorPath = textEditor.getPath()

            // Do something sync
            return [{
                severity: 'note',
                location: {
                    file: editorPath,
                    position: [[0, 0], [0, 1]],
                },
                excerpt: `Sync: A random value is ${Math.random()}`,
                description: `### What is this?\nThis is a randomly generated value`
            }]

        }
    }
}
