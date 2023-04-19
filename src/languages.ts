import { LanguageParser } from "./types";

const languages: Record<string, LanguageParser> = {
  Ada: {
    fileExtension: ["adb", "ads"],
    parserName: "tree-sitter-ada",
  },
  Agda: {
    fileExtension: ["agda"],
    parserName: "tree-sitter-agda",
  },
  Apex: {
    fileExtension: ["cls", "trigger"],
    parserName: "tree-sitter-apex",
  },
  Bash: {
    fileExtension: ["sh", "bash"],
    parserName: "tree-sitter-bash",
  },
  Beancount: {
    fileExtension: ["beancount"],
    parserName: "tree-sitter-beancount",
  },
  CapnProto: {
    fileExtension: ["capnp"],
    parserName: "tree-sitter-capnp",
  },
  C: {
    fileExtension: ["c"],
    parserName: "tree-sitter-c",
  },
  CPP: {
    fileExtension: ["cpp", "cc", "cxx", "c++", "h", "hpp", "hh", "hxx", "h++"],
    parserName: "tree-sitter-cpp",
  },
  CSharp: {
    fileExtension: ["cs"],
    parserName: "tree-sitter-c-sharp",
  },
  Clojure: {
    fileExtension: ["clj", "cljs", "cljc", "edn"],
    parserName: "tree-sitter-clojure",
  },
  CMake: {
    fileExtension: ["cmake", "CMakeLists.txt"],
    parserName: "tree-sitter-cmake",
  },
  // Comment: {
  //   fileExtension: ["unknown"], // Not specific to any file extension
  //   parserName: "tree-sitter-comment",
  // },
  CommonLisp: {
    fileExtension: ["lisp", "lsp", "l", "cl", "mud"],
    parserName: "tree-sitter-commonlisp",
  },
  CSS: {
    fileExtension: ["css"],
    parserName: "tree-sitter-css",
  },
  CUDA: {
    fileExtension: ["cu", "cuh"],
    parserName: "tree-sitter-cuda",
  },
  Dart: {
    fileExtension: ["dart"],
    parserName: "tree-sitter-dart",
  },
  D: {
    fileExtension: ["d"],
    parserName: "tree-sitter-d",
  },
  Dockerfile: {
    fileExtension: ["Dockerfile"],
    parserName: "tree-sitter-dockerfile",
  },
  DOT: {
    fileExtension: ["dot"],
    parserName: "tree-sitter-graphviz",
  },
  Elixir: {
    fileExtension: ["ex", "exs"],
    parserName: "tree-sitter-elixir",
  },
  Elm: {
    fileExtension: ["elm"],
    parserName: "tree-sitter-elm",
  },
  EmacsLisp: {
    fileExtension: ["el"],
    parserName: "tree-sitter-emacs-lisp",
  },
  Eno: {
    fileExtension: ["eno"],
    parserName: "tree-sitter-eno",
  },
  ERB_EJS: {
    fileExtension: ["erb", "ejs"],
    parserName: "tree-sitter-embedded-template",
  },
  Erlang: {
    fileExtension: ["erl", "hrl"],
    parserName: "tree-sitter-erlang",
  },
  Fennel: {
    fileExtension: ["fnl"],
    parserName: "tree-sitter-fennel"
  },
  Fish: {
    fileExtension: ["fish"],
    parserName: "tree-sitter-fish"
  },
  Fortran: {
    fileExtension: ["f", "f90", "f95"],
    parserName: "tree-sitter-fortran"
  },
  Gleam: {
    fileExtension: ["gleam"],
    parserName: "tree-sitter-gleam"
  },
  GLSL: {
    fileExtension: ["glsl", "vert", "frag", "geom"],
    parserName: "tree-sitter-glsl"
  },
  Go: {
    fileExtension: ["go"],
    parserName: "tree-sitter-go"
  },
  Graphql: {
    fileExtension: ["graphql"],
    parserName: "tree-sitter-graphql"
  },
  Hack: {
    fileExtension: ["hack"],
    parserName: "tree-sitter-hack"
  },
  Haskell: {
    fileExtension: ["hs","lhs"],
    parserName: "tree-sitter-haskell"
  },
  HCL: {
    fileExtension: ["hcl"],
    parserName: "tree-sitter-hcl"
  },
  HTML: {
    fileExtension: ["html"],
    parserName: "tree-sitter-html"
  },
  Java: {
    fileExtension: ["java"],
    parserName: "tree-sitter-java"
  },
  JavaScript: {
    fileExtension: ["js", "jsx"],
    parserName: "tree-sitter-javascript"
  },
  jq: {
    fileExtension: ["jq"],
    parserName: "tree-sitter-jq"
  },
  JSON5: {
    fileExtension: ["json5"],
    parserName: "tree-sitter-json5"
  },
  JSON: {
    fileExtension: ["json"],
    parserName: "tree-sitter-json"
  },
  Julia: {
    fileExtension: ["jl"],
    parserName: "tree-sitter-julia"
  },
  Kotlin: {
    fileExtension: ["kt", "kts"],
    parserName: "tree-sitter-kotlin"
  },
  LALRPOP: {
    fileExtension: ["lalrpop"],
    parserName: "tree-sitter-lalrpop"
  },
  Latex: {
    fileExtension: ["tex", "sty", "cls"],
    parserName: "tree-sitter-latex"
  },
  Lean: {
    fileExtension: ["lean"],
    parserName: "tree-sitter-lean"
  },
  LLVM: {
    fileExtension: ["ll"],
    parserName: "tree-sitter-llvm"
  },
  LLVM_MachineIR: {
    fileExtension: ["mir"],
    parserName: "tree-sitter-llvm-mir"
  },
  LLVM_TableGen: {
    fileExtension: ["td"],
    parserName: "tree-sitter-llvm-td"
  },
  Lua: {
    fileExtension: ["lua"],
    parserName: "tree-sitter-lua"
  },
  Make: {
    fileExtension: ["makefile"],
    parserName: "tree-sitter-make"
  },
  Markdown: {
    fileExtension: ["md", "markdown"],
    parserName: "tree-sitter-markdown"
  },
  Meson: {
    fileExtension: ["meson.build"],
    parserName: "tree-sitter-meson"
  },
  Motorola68000Assembly: {
    fileExtension: ["s"],
    parserName: "tree-sitter-m68k"
  },
  Nix: {
    fileExtension: ["nix"],
    parserName: "tree-sitter-nix"
  },
  ObjectiveC: {
    fileExtension: ["m", "h"],
    parserName: "tree-sitter-objc"
  },
  OCaml: {
    fileExtension: ["ml", "mli"],
    parserName: "tree-sitter-ocaml"
  },
  Org: {
    fileExtension: ["org"],
    parserName: "tree-sitter-org"
  },
  Pascal: {
    fileExtension: ["pas"],
    parserName: "tree-sitter-pascal"
  },
  Perl: {
    fileExtension: ["pl", "pm"],
    parserName: "tree-sitter-perl"
  },
  PerlPOD: {
    fileExtension: ["pod"],
    parserName: "tree-sitter-pod"
  },
  PHP: {
    fileExtension: ["php"],
    parserName: "tree-sitter-php"
  },
  PowerShell: {
    fileExtension: ["ps1"],
    parserName: "tree-sitter-powershell"
  },
  ProtocolBuffers: {
    fileExtension: ["proto"],
    parserName: "tree-sitter-protobuf"
  },
  Python: {
    fileExtension: ["py"],
    parserName: "tree-sitter-python"
  },
  QML: {
    fileExtension: ["qml"],
    parserName: "tree-sitter-qml"
  },
  Racket: {
    fileExtension: ["rkt"],
    parserName: "tree-sitter-racket"
  },
  Rasi: {
    fileExtension: ["rasi"],
    parserName: "tree-sitter-rofi"
  },
  re2c: {
    fileExtension: ["re"],
    parserName: "tree-sitter-re2c"
  },
  Regex: {
    fileExtension: ["regex"],
    parserName: "tree-sitter-regex"
  },
  Rego: {
    fileExtension: ["rego"],
    parserName: "tree-sitter-rego"
  },
  reStructuredText: {
    fileExtension: ["rst"],
    parserName: "tree-sitter-rst"
  },
  R: {
    fileExtension: ["r"],
    parserName: "tree-sitter-r"
  },
  Ruby: {
    fileExtension: ["rb"],
    parserName: "tree-sitter-ruby"
  },
  Rust: {
    fileExtension: ["rs"],
    parserName: "tree-sitter-rust"
  },
  Scala: {
    fileExtension: ["scala"],
    parserName: "tree-sitter-scala"
  },
  Scheme: {
    fileExtension: ["scm", "ss"],
    parserName: "tree-sitter-scheme"
  },
  Scss: {
    fileExtension: ["scss"],
    parserName: "tree-sitter-scss"
  },
  Sexpressions: {
    fileExtension: ["sexp"],
    parserName: "tree-sitter-sexp"
  },
  Smali: {
    fileExtension: ["smali"],
    parserName: "tree-sitter-smali"
  },
  Sourcepawn: {
    fileExtension: ["sp"],
    parserName: "tree-sitter-sourcepawn"
  },
  SPARQL: {
    fileExtension: ["rq"],
    parserName: "tree-sitter-sparql"
  },
  SQL_BigQuery: {
    fileExtension: ["sql"],
    parserName: "tree-sitter-sql"
  },
  SQL_PostgreSQL: {
    fileExtension: ["pgsql"],
    parserName: "tree-sitter-sql"
  },
  SQL_SQLite: {
    fileExtension: ["sqlite"],
    parserName: "tree-sitter-sql"
  },
  SSH: {
    fileExtension: ["sshconfig"],
    parserName: "tree-sitter-ssh"
  },
  Svelte: {
    fileExtension: ["svelte"],
    parserName: "tree-sitter-svelte"
  },
  Swift: {
    fileExtension: ["swift"],
    parserName: "tree-sitter-swift"
  },
  SystemRDL: {
    fileExtension: ["rdl"],
    parserName: "tree-sitter-systemrdl"
  },
  Thrift: {
    fileExtension: ["thrift"],
    parserName: "tree-sitter-thrift"
  },
  TOML: {
    fileExtension: ["toml"],
    parserName: "tree-sitter-toml"
  },
  Turtle: {
    fileExtension: ["ttl"],
    parserName: "tree-sitter-turtle"
  },
  Twig: {
    fileExtension: ["twig"],
    parserName: "tree-sitter-twig"
  },
  TypeScript: {
    fileExtension: ["ts", "tsx"],
    parserName: "tree-sitter-typescript"
  },
  Verilog: {
    fileExtension: ["v", "sv", "svh"],
    parserName: "tree-sitter-verilog"
  },
  VHDL: {
    fileExtension: ["vhdl", "vhd", "vhf", "vhi", "vho", "vhs", "vht", "vhw"],
    parserName: "tree-sitter-vhdl"
  },
  Vue: {
    fileExtension: ["vue"],
    parserName: "tree-sitter-vue"
  },
  WASM: {
    fileExtension: ["wat", "wasm"],
    parserName: "tree-sitter-wasm"
  },
  YAML: {
    fileExtension: ["yaml", "yml"],
    parserName: "tree-sitter-yaml"
  },
  YANG: {
    fileExtension: ["yang"],
    parserName: "tree-sitter-yang"
  },
  Zig: {
    fileExtension: ["zig"],
    parserName: "tree-sitter-zig"
  },
}

export default languages;