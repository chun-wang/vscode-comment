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
export class Commenter {
    private comments: string;
    private arguments: Array<Argument>;
    protected return: string;

    constructor(protected code: string) {
        this.code = code;

        this.comments = "";
        this.arguments = new Array<Argument>();
        this.return = "";
    }

    comment(description = "Description"): string {

      // comment start
      this.comments = "/**\n"
                    + " *\t@brief\t<#" + description + "#>\n";

      // arguemts
      this.comments += " *\n";
      this.arguments.forEach(argument => {
          this.comments += (" *\t@param \t" + argument.name + " \t<#" + argument.name + " description#>\n");
      });

      // return
      if (this.return.length) {
        this.comments += " *\n";
        this.comments += " *\t@return\t" + this.return + "\t<#return value description#>\n";   
      }

      // comment end
      this.comments += " *\n";
      this.comments += " **/";

      return this.comments;
    }

    isMultiLine(): boolean {
        return this.code.match(/\n/) != null;
    }

    // Parses a comma delimited list into an array of Argument objects
    parse_c_style_argument_list(args: string): void {
        var arglist = args.split(/,/);
        if (arglist.length <= 1) {
            return;
        }

        arglist.forEach(argument_text => {
            var parts = argument_text.split(/\s+/);
            var type = parts[parts.length-1];
            var name = parts.slice(0, parts.length-1).join(" ");
            this.arguments.push(new Argument(name, type));
        });
    }

    parse_cstyle_return(ret: string): void {
        var matches = ret.match(/(.*[a-zA-Z])\s*\(/);
        if (matches == null || matches.length < 2) {
            return;
        }

        var retType = matches[1].split(/\s/).slice(0,-1).join(" ");
        if (retType.match(/void/)) {
            return;
        }

        this.return = retType;
    }
}

/**
 * FunctionCommenter extends Commenter
 */
export class FunctionCommenter extends Commenter {
    constructor(code: string) {
        super(code);
    }

    comment(description = "Description"): string {
        // get arguemts
        super.parse_c_style_argument_list(this.code.match(/\(([^\(\)]*)\)/)[1]);

        // TODO: get return
        super.parse_cstyle_return(this.code);

        // build comments
        return super.comment(description)
    }
}

/**
 * VariableCommenter
 */
export class VariableCommenter extends Commenter {
    constructor(code: string) {
        super(code);
    }

    comment(description = "Description"): string {
        return "";
    }
}
