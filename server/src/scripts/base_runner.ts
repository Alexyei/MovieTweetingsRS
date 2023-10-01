export class BaseRunner {
    _runners: {args: string[], runner: () => any}[];
    constructor() {
        if (this.constructor == BaseRunner) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    run(args:string[]): any {
        if (args.length == 0 || args.includes('help')){
            this.showHint()
            return;
        }

        for(const runner of this._runners){
            if (args.length == runner.args.length){
                if ( args.every((element) => runner.args.includes(element))){
                    runner.runner()
                    return;
                }
            }
        }

        this.showHint();
    }
    showHint(): any {
        throw new Error("Method 'showHint()' must be implemented.");
    }
}







