import "../../static/css/reset.css"
import "./index.scss"
import multiply from "../../static/js/main"

class Test {
    constructor(){
        // 默认返回实例对象 this
    }
}
console.log(new Test() instanceof Test); // true
 
class Example {
    constructor(){
        // 指定返回对象
        return new Test();
    }
}
console.log(multiply); // false