# linter-clang-tidy

Linter package for clang-tidy.


## Installation

* Install [clang-tidy](http://clang.llvm.org/extra/clang-tidy/) (`$ sudo apt install clang-tidy` for example)
* `$ apm install linter-clang-tidy`


## Package configuration
* **Executable:** Path to your clang-tidy executable.
* **Options:** Flags to append to the command line. Leave it empty if you have your config file (recommended).
  Otherwise, you can try `-checks=*` to use it at its full power.
* **Timeout:** Time before the process is stopped.


## How to configure clang-tidy

* Test all checks on existing code, with `-checks=*`
* Create a config file with `-dump-config`. It creates a file ".clang-tidy" that saves your configuration in the current directory.
  clang-tidy attempts to read configuration for each source file from a _.clang-tidy_ file located in the closest parent directory of the source file.
* See the checks enabled with `-list-checks` and edit your config file to disable those you don't need. The less you have, the faster clang-tidy.
