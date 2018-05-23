'use babel';
import { CompositeDisposable } from 'atom';


export function activate() {
    require('atom-package-deps').install('linter-clang-tidy');

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-clang-tidy.execPath',
        (value) => { this.execPath = value;}));

    this.subscriptions.add(atom.config.observe('linter-clang-tidy.options',
        (value) => { this.options = value;}));

    this.subscriptions.add(atom.config.observe('linter-clang-tidy.timeout',
        (value) => { this.timeout = value;}));
}

export function deactivate() {
    this.subscriptions.dispose();
}

helpers = require('atom-linter');
const regex = `(?<file>.+):(?<line>\\d+):(?<col>\\d+):\\s*\\w*\\s*(?<type>(${"warning"}|${"error"}))\\s*:\\s*(?<message>.*)`;

export function provideLinter() {
    return {
        name: 'clang-tidy',
        scope: 'file',
        lintsOnChange: false,
        grammarScopes: ['source.cpp'],

        lint(textEditor) {
            const editorPath = textEditor.getPath();
            const execPath = atom.config.get('linter-clang-tidy.execPath');
            const timeout = atom.config.get('linter-clang-tidy.timeout') * 1000;
            parameters = [];
            if (typeof atom.config.get('linter-clang-tidy.options') !== 'undefined')
                parameters = (atom.config.get('linter-clang-tidy.options')).split(" ");
            parameters.push(editorPath);

            const execOpts = {stream: 'both', timeout: timeout};

            console.log(execPath + ' ' + parameters);
            return helpers.exec(execPath, parameters, execOpts).then (output => {
                data = output.stdout;
                console.log("data: " + data.length);
                lines = helpers.parse(data, regex);
                results = [];
                console.log("lines: " + lines.length);
                lines.forEach(function(entry) {
                    result = {};

                    result.location = {};
                    result.location.file = entry.filePath;
                    result.location.position = entry.range;

                    result.severity = entry.type;

                    result.excerpt = entry.text;
                    result.description = entry.text;

                    results.push(result);
                });
                console.log("results: " + results.length);
                return results;
            })
            .catch(function(error) {
                console.log(error);
                atom.notifications.addWarning("[Linter] linter-clang-tidy",
                    {detail: " \nProcess interrupted:\nTry increasing the timeout in the package options",
                     description: editorPath,
                     icon: 'alert',
                     dismissable: "true"});
                return [];
            });

        }
    };
}
