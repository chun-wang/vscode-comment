/**
 * Argument
 */
class Argument {
    constructor(public type:string, public name:string) {
        this.setType(type);
        this.setName(name);
    }

    private setName(name: string) {
        if (name == null) {
            return;
        }

        this.name = name.replace(/^&/, '')
                        .replace(/^\*/, '')
                        .replace(/\[.*$/, '')
                        .replace(/,$/, '')
                        .replace(/;$/, '')
                        .replace(/^\s*/, '')
                        .replace(/\s*$/, '');

        if (this.name === '...') {
            this.name = 'vararg_list';
        }
    }

    private setType(type: string) {
        if (type == null) {
            return;
        }

        this.type = type.replace(/&$/, '')
                        .replace(/\s*\*$/, '')
                        .replace(/^\s*/, '')
                        .replace(/\s*$/, '');
    }
}

/**
 * Commenter
 */
class Commenter {
    private comments: string;
    private arguments: Array<Argument>;

    constructor(private indent: string, private code: string) {
        this.indent = indent;
        this.code = code;
    }

    comment(description = "Description") {

      // comment start
      this.comments = this.indent + "/**\n" +
                      this.indent + " *\t@brief\t<#" + description + "#>\n";

      // arguemts
      this.comments += (this.indent + " *\n");
      this.arguments.forEach(argument => {
          this.comments += (this.indent + " *\t@param \t" + argument.name + " \t<#" + argument.name + " description#>\n");
      });

      // return
      this.comments += (this.indent + " *\n");
      this.comments += (this.indent + " *\t@return\t<#return value description#>\n");

      // comment end
      this.comments += (this.indent + " *\n");
    }

    isMultiLine() {
        return this.code.match(/\n/) != null;
    }

    // Parses a comma delimited list into an array of Argument objects
    parse_c_style_argument_list() {
        this.code.split(/,/).forEach(argument_text => {
            var parts = argument_text.split(/\s+/);
            var name = parts[parts.length-1];
            var type = parts.slice(0, parts.length-1).join(" ");
            this.arguments.push(new Argument(name, type));
        });
    }
}

/**
 * VariableCommenter
 */
class VariableCommenter extends Commenter {
    constructor(indent: string, code: string) {
        super(indent, code);
    }

    comment(description = "Description") {

    }
}
