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
const regex = `(?<file>.+):(?<line>\\d+):(?<col>\\d+):\\s*\\w*\\s*(?<type>(${"warning"}|${"error"}|${"note"}))\\s*:\\s*(?<message>.*)`

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

            return helpers.exec(execPath, parameters, execOpts).then (output => {
                console.log("Output clang:")
                console.log(output.stdout);
                data = output.stdout;
                lines = helpers.parse(data, regex)
                results = []
                console.log("Lines clang:")
                console.log(lines);
                lines.forEach(function(entry) {
                    result = {}

                    result.location = {}
                    result.location.file = entry.filePath
                    result.location.position = entry.range

                    result.severity = entry.type

                    result.excerpt = entry.text
                    result.description = entry.text

                    results.push(result)
                })
                console.log("Results:")
                console.log(results)
                // paramgcc= ["-Wall", "-pedantic"]
                // paramgcc.push(editorPath)
                // // helpers.exec("g++", paramgcc, {stream: 'stderr'}).then (outputgcc => {
                //     console.log("Output g++")
                //     console.log(outputgcc)
                //     linesgcc = helpers.parse(outputgcc, regex)
                //     console.log("Lines gcc:")
                //     console.log(linesgcc)
                // })
                // // lines.forEach(function(entry) {
                //
                // })
                return results
            })

        }
    }
}
