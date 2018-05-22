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
        grammarScopes: ['source.cpp'],
        lint(textEditor) {
            const editorPath = textEditor.getPath()
            const execPath = atom.config.get('linter-clang-tidy.execPath');
            parameters = (atom.config.get('linter-clang-tidy.options')).split(" ");
            parameters.push(editorPath);
            const execOpts = {stream: 'both'};
            console.log(editorPath)
            console.log(execPath);
            console.log(parameters)
            console.log(execPath + ' ' + parameters + ' ' + execOpts);
            console.log(editorPath);
            // Do something sync

            return helpers.exec(execPath, parameters, execOpts).then (result => {
                console.log(result.stdout);
                return [{
                    severity: 'note',
                    location: {
                        file: editorPath,
                        position: [[0, 0], [0, 1]],
                    },
                    excerpt: `Sync: A random value is ${Math.random()}`,
                    description: `### What is this?\nThis is a randomly generated value`
                }]
            })

        }
    }
}
