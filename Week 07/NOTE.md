## Atom & Expression

### Grammer

#### Tree VS Priority

* \+ -
* \* /
* ()

#### Expressions (优先级最末的一个结构)

优先级从低到高排列：

1. Member
    * a.b
    * a[b]
    * foo\`string`
    * super.b
    * suoer[`b`]
    * new.target
    * new Foo()
  
2. New
    * new Foo
      * Example:
        new a()() = (new a())()
        new new a() = new (new a())

3. Call
    * foo()
    * super()
    * foo()['b'] Member Expression 这里会被拉低优先级
    * foo().b
    * foo()\`abc`
      * Example:
        new a()['b'] = (new a())['b']

4. Update (从 Update 开始就是 RH 了)
    * a ++
    * a --
    * -- a
    * ++ a
      * Example:
        ++ a ++ = ++ (a++) 但他们语法和运行时都是不合法的

5. Unary (单目运算)
    * delete a.b (a.b 是 Reference 类型)
    * void foo() (void 是把不管后面什么东西都变成 undefined)
    * typeof a
    * \+a (类型转换)
    * \-a
    * ~a (按位取反)
    * !a
    * await a

6. Exponental (右结合，其他大部分是左结合)
    * \*\*
      * Example:
        3 \*\* 2 \*\* 3 = 3 \*\* ( 2 \*\* 3 )

7. Multiplicative
    * \* / %

8. Additive
    * \+ -

9. shift
    * << >> >>>

10. Relationship
    * < > <= >= instanceof
    * in

11. Equality
    * ==
    * !=
    * ===
    * !==

12. Bitwise
    * & 按位与
    * ^ 亦或
    * | 按位或

13. Logical (短路逻辑)
    * &&
    * ||

14. Conditional (也有短路逻辑)
    * ? :

##### Reference 
Reference 是标准中的类型，7种基本类型是语言中的类型

reference 分成两部分

* Object
* Key (String | Symbol)

如果是加减法运算，reference 就会直接解引用，像普通变量取使用
当删除和赋值时要知道主体是谁，是哪个属性

* delete
* assign

##### Expressions (Left Handside & Right Handside)

Example:

* a.b = c a.b 是 LH，所以可以放在 = 左边
* a + b = c a+b 是 RH，只能放在 = 右边

LH 定义就是能放在等号左边的表达式，不能的就是 RH


#### Type Convertion

* a + b
* "false" == false (不等，"" 是 falsy) == 一般先被转为 Number，再转 boolean
* a[o] = 1


##### unBoxing

* ToPremtitive
  * toString vs valueOf
  * Symbol.toPrimitive

```js
    toString() { return '2' },
    valueOf() { return 1 },
    [ Symbol.toPrimitive ]() { return 3} (优先级最高)

    // 作为属性名，优先调用 toString
    var x = {};
    x[o] = 1

    // 加法优先调用 valueOf
    console.log("x" + o)
```

##### Boxing

```js
'a'[b] // 'a' 被取属性 b，会自动调用装箱(Boxing)构造器
```

Number Class 上定义的值和 number 值不同，可通过 typeOf 查看

## Statement

### Grammer

#### 简单语句

* ExpressionStatement (表达式;)
* EmptyStatement (为了语言完备性, 空;)
* DebuggerStatement (debugger)
* ThrowStatement (抛出异常 throw expression)
* ContinueStatement (结束当次循环)
* BreakStatement (结束整个循环)
* ReturnStetment (返回函数值)

#### 复合语句

* BlockStatement ({})
* IfStatement
* SwitchStatement (JS 里没有性能优势，建议用 IfStatement 代替)
* IterationStatement (while, do while, for...)
* WithStatement (不确定性高，不要使用)
* LabelledStatement (给语句取名字, 可以在任何地方用)
* TrySatement (try, catch, finally)

##### BlockStatement

* \[[type]]: normal
* \[[value]]: --
* \[[target]]: --

##### IterationStatement

##### LabelledStatement, IterationStatement, ContinueStatement, BreakStatement, SwitchStatement

* \[[type]]: break continue
* \[[value]]: --
* \[[target]]: label

##### TryStatement

```js
try {
  xxx
} catch (yyy) {
  xxx
} finally {
  xxx
}
// yyy 是一个作用域，接收抛出的错误
// 即使在 try 里 return 了， finally 也会执行
```

* \[[type]]: return
* \[[value]]: --
* \[[target]]: label

###### Complation Record 类型 （不在基本类型里）

```js
if (x == 1)
  return 10;
// 有 return，也肯能没 return
// 需要一个数据结果来描述语句的执行结果：是否返回了？ 返回值是啥？ 等等。。。
```

* \[[type]]: normal, break, continue, return or throw
* \[[value]]: 基本类型
* \[[target]]: label (break, continue 就会带 target，指向下一个循环层的 label)

#### 声明

* FunctionDeclaration
* GeneratorDeclaration
* AsyncFunctionDeclaration
* AsyncGeneratorDeclaration
* VariableDeclaration
* CalssDeclaration
* LexicalDeclaration (const, let)

##### 旧的声明

* function
* function *
* async function
* async function *
* var

function 作用范围只认 function body, 而且没有先后关系，会被提升
var 声明会被提升，但不会被赋值

##### 新的声明

* class
* const
* let

有预处理，但是声明之前引用会报错

###### 预处理 (pre-process)

###### 作用域

```js
var a = 2;
void function () {
  a = 1;
  {
    var a;
  }
}();
console.log(a);
// var 的作用范围是整个函数体，不论写在哪
```

```js
var a = 2;
void function () {
  a = 1;
  {
    const a;
  }
}();
console.log(a);
// const/let 的作用域就在所在的{}
// 在循环语句中的范围是整个循环语句
```

### Structure

#### JS执行粒度 （运行时）

* 宏任务 传给 JS 引擎的任务，最大粒度
* 微任务 (Promise) 在 JS 引擎内部的任务
* 函数调用 (Execution Context)
* 语句/声明 (Completion Record)
* 表达式 (Reference)
* 直接量/变量/this ...

##### 宏任务与微任务


##### 函数调用

---

```js
import { foo } from "foo.js";
var i = 0;
console.log(i);
foo();
console.log(i);
i++;
```


###### Execution Context

* LexicalEnvironment
  * this
  * new.target
  * super
  * 变量

* Realm
 * 在 JS 中，函数表达式和对象直接量都会创建对象
 * 使用 . 做隐式转换也会创建对象
 * 这些对象也是有原形的，如果没有 Realm ，就不知道他们的原型是什么
 * 不同的 Realm 之间是完全独立的, instanceOf 可能会失效
 * Realm 实例之间可以传递对象，但是传递过来后的 Prototype 是不一致的
