import * as Commenters from "./commenter";

export class Documenter {
	private target: string;

	constructor(target: string) {
		this.target = target;
	}

	document(): string {
		var commenter: Commenters.Commenter;
		if (this.isFunction()) {
			commenter = new Commenters.FunctionCommenter(this.target);
		} else {
			console.log("unknow type");
		}

		return commenter.comment();
	}

	isFunction() {
		return this.isMacro() || this.target.match(/^\s*[+-]/i) != null || this.target.match(/\(/i) != null;
	}

	isMacro() {
		return this.target.match(/^\s*\#define/i) != null;
	}

	isEnum() {
		return this.target.match(/^\s*(\w+\s)?enum.*\{.*\}/i) != null;
	}

	isStruct() {
		return this.target.match(/^\s*(\w+\s)?struct.*\{.*\}/i) != null;
	}
    
	isUnion() {
		return this.target.match(/^\s*(\w+\s)?union.*\{.*\}/i) != null;
	}
}
