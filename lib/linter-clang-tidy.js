'use babel'
import { CompositeDisposable } from 'atom';


export function activate() {
    require('atom-package-deps').install('linter-clang-tidy')

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-clang-tidy.execPath',
        (value) => { this.execPath = value;}));

    this.subscriptions.add(atom.config.observe('linter-clang-tidy.options',
        (value) => { this.options = value;}));
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
            const parameters = atom.config.get('linter-clang-tidy.options');
            const execPath = atom.config.get('linter-clang-tidy.execPath');
            const execOpts = {stream: 'stdout'};
            console.log(atom.config.get('linter-clang-tidy.options'))
            console.log(atom.config.get('linter-clang-tidy.execPath'))
            console.log(execOpts);
            console.log(execPath + ' ' + parameters + ' ' + execOpts);
            console.log(editorPath);
            // Do something sync

            //const data = helpers.exec(execPath, parameters, execOpts);
            //console.log(data);
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
