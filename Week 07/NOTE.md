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
 
 
 
 # 第八章 对象、类与面向对象编程
**本章内容**
- 理解对象
- 理解对象创建过程
- 理解继承
- 理解类

## 理解对象
两种创建方式：
![30446b4239ab4e03747562a67d5a2f7e.png](en-resource://database/2791:1)

![b5dbb6c5b3d95066f3b2fc8f30ea3b4e.png](en-resource://database/2793:1)

### 8.1.1 属性的类型
分为两种：数据属性和访问器属性
##### 数据属性的四个特性：
- Configurable： 是否可以通过delete删除并重新定义，是否可以修改它的属性，以及是否可以把它改为访问器属性。（默认true）
- Enumerable：表示属性是否可以通过for-in循环返回（默认true）
- Writable：表示属性值是否可以修改（默认true）
- Value：包含属性实际的值

###### 访问器属性
访问器属性不包含数据值。相反，他们包含一个获取（getter）函数和一个设置（setter）函数，不过这两个函数不是必须的。
- Configurable
- Enumerable
- Get
- Set

### 8.1.2 定义多个属性

![cfac3e6a59c573ce04f786072a4b061d.png](en-resource://database/2809:1)

### 8.1.4 合并对象

result = Object.assign(dest, src);
**获取和设置函数不可以转移**

### 8.1.4 对象标识及相等判定
ES6之前 +0，-0,0被认为相等（===）
确定NaN要用isNaN()

ES6新增了Object.is()这个方法与===很像，但同时也考虑了上面的边界情形
```js
// 正确的 0、-0、+0 相等/不等判定
console.log(Object.is(+0, -0)); // false
console.log(Object.is(+0, 0)); // true
console.log(Object.is(-0, 0)); // false 

// 正确的 NaN 相等判定 console.log(Object.is(NaN, NaN)); // true

```
### 增强的对象语法
ES6为定义和操作对象新增了很多极其有用的语法糖特性。这些特性都咩有改变现有引擎的行为，但极大地提升了处理对象的方便程度

#### 1.属性值简写
属性名与变量名相同时
```js
let name = 'Matt'; 
let person = { name }; 
console.log(person); // { name: 'Matt' }
```

#### 2.可计算属性
在引入可计算属性之前，如果想使用变量的值作为属性，必须先声明对象，然后通过中括号语法添加属性，即不能在对象字面量中直接动态命名属性
```js
const nameKey = 'name'; 
const ageKey = 'age';
const jobKey = 'job'; 
let person = {}; 
person[nameKey] = 'Matt'; 
person[ageKey] = 27; 
person[jobKey] = 'Software engineer'; 
console.log(person); // { name: 'Matt', age: 27, job: 'Software engineer' }
```
有了可计算属性，可以在对象字面量中完成动态属性赋值。**中括号包围的对象属性告诉运行时将其作为JavaScript表达式而不是字符串来求值**：
```js
const nameKey = 'name'; 
const ageKey = 'age'; 
const jobKey = 'job'; 
let person = { 
    [nameKey]: 'Matt', 
    [ageKey]: 27, 
    [jobKey]: 'Software engineer' 
}; 
console.log(person); // { name: 'Matt', age: 27, job: 'Software engineer' }
```
#### 简写方法名
```js
//从
sayName: function(name) {
//变为
sayName(name) {
```
简写方法名可以和可计算属性一起使用
```js
const methodKey = 'sayName'; 
let person = { 
    [methodKey](name) {                         console.log(`My name is ${name}`); 
    }
}
```
### 8.1.7 对象解构
ECMAScript 6 新增了对象解构语法，可以在一条语句中使用嵌套数据实现一个或多个赋值操作。简 单地说，对象解构就是使用与对象匹配的结构来实现对象属性赋值。
```js
// 不使用对象解构 
let person = { name: 'Matt', age: 27 };

let personName = person.name, 
personAge = person.age; 
console.log(personName); // Matt 
console.log(personAge); // 27

// 使用对象解构 
let person = { name: 'Matt', age: 27 };
let { name: personName, age: personAge } = person; 
console.log(personName); // Matt 
console.log(personAge); // 27
```
## 8.2 创建对象
虽然使用 Object 构造函数或对象字面量可以方便地创建对象，但这些方式也有明显不足：创建具 有同样接口的多个对象需要重复编写很多代码。

ECMAScript 6 开始正式支持类和继承。ES6 的类旨在完全涵盖之前规范设计的基于原型的继承模 式。不过，无论从哪方面看，ES6 的类都仅仅是封装了 ES5.1 构造函数加原型继承的语法糖而已。

### 8.2.2 工厂模式
工厂模式是一种众所周知的设计模式，广泛应用于软件工程领域，用于抽象创建特定对象的过程。

下面的例子展示了一种按照特定接口创 建对象的方式：![6a3e5e63b85b860c14fedcb304bbf999.png](en-resource://database/2811:1)

这种工厂模式虽 然可以解决创建多个类似对象的问题，但没有解决对象标识问题（即新创建的对象是什么类型）。

### 8.2.3 构造函数模式
![7bbe08ecd98c264b8150148f14047ef7.png](en-resource://database/2813:1)
通过构造函数模式可以明确知道是Person类型的对象

constructor 本来是用于标识对象类型的。工厂模式得到的两个对象实例都可以通过
console.log(person1.constructor == Person); // true 
console.log(person2.constructor == Person); // true

不过一般认为instanceof操作符是确定对象类型的更可靠的方式
```js
console.log(person1 instanceof Object); // true 
console.log(person1 instanceof Person); // true 
console.log(person2 instanceof Object); // true 
console.log(person2 instanceof Person); // true
```

构造函数不一定要写成函数声明的形式。赋值给变量的函数表达式也可以表示构造函数：
![3c6ef24eb70b24d21e35ca38cde8c485.png](en-resource://database/2815:1)

构造函数与普通函数唯一的区别就是调用方式不同。任何函数只要使用 new 操作符调用就是构造函数，而不使用 new 操 作符调用的函数就是普通函数。![2aa60a73c8b6818f7b7ce558edaf9571.png](en-resource://database/2817:1)

最后展 示的调用方式是通过 call()（或 apply()）调用函数，同时将特定对象指定为作用域。这里的调用将 对象 o 指定为 Person()内部的 this 值，因此执行完函数代码后，所有属性和 sayName()方法都会添 加到对象 o 上面。

#### 构造函数的问题
构造函数定义的方法会在每个实例上都创建一遍，因为都是做一样的事，所以没必要定义两个或者说多个不同的function实例。
解决这个问题，可以把函数定义移到构造函数外部![5b08a92c37c9326e637965e4794fc07a.png](en-resource://database/2819:1)
这样做虽然达到了相同逻辑函数重用的目的，但是全局作用域定义多个函数会乱很多，不优雅。这个问题可以通过原型模式来解决
### 8.2.4 原型模式

每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含应该由特定引用类型的实例 共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处 是，在它上面定义的属性和方法可以被对象实例共享。原来在构造函数中直接赋给对象实例的值，可以 直接赋值给它们的原型，如下所示：
![fbd1cbe64c975eb3524ae4ba61ea9c38.png](en-resource://database/2821:1)

与构造函数模 式不同，使用这种原型模式定义的属性和方法是由所有实例共享的。因此 person1 和 person2 访问的 都是相同的属性和相同的 sayName()函数。要理解这个过程，就必须理解 ECMAScript 中原型的本质。

#### 1.理解原型（p250没懂再看）

无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个 prototype 属性（指向 原型对象）。默认情况下，所有原型对象自动获得一个名为 constructor 的属性，指回与之关联的构 造函数。对前面的例子而言，Person.prototype.constructor 指向 Person。然后，因构造函数而 异，可能会给原型对象添加其他属性和方法。 在自定义构造函数时，原型对象默认只会获得 constructor 属性，其他的所有方法都继承自 Object。每次调用构造函数创建一个新实例，这个实例的内部[[Prototype]]指针就会被赋值为构 造函数的原型对象。脚本中没有访问这个[[Prototype]]特性的标准方式，但 Firefox、Safari 和 Chrome 会在每个对象上暴露__proto__属性，通过这个属性可以访问对象的原型。在其他实现中，这个特性 完全被隐藏了。关键在于理解这一点：实例与构造函数原型之间有直接的联系，但实例与构造函数之 间没有。

### 8.2.5 对象迭代（259开始的原型问题再看）

ECMAScript 2017 新增了两 个静态方法，用于将对象内容转换为序列化的——更重要的是可迭代的——格式。这两个静态方法 Object.values()和 Object.entries()接收一个对象，返回它们内容的数组。Object.values() 返回对象值的数组，Object.entries()返回键/值对的数组。
**注意**
![2eae2329e278d42fde2455bf331eb395.png](en-resource://database/2823:1)

## 8.3 继承（。。。263）

继承是面向对象编程中讨论最多的话题。很多面向对象语言都支持两种继承：接口继承和实现继承。 前者只继承方法签名，后者继承实际的方法。接口继承在 ECMAScript 中是不可能的，因为函数没有签 名。实现继承是 ECMAScript 唯一支持的继承方式，而这主要是通过原型链实现的。

## 8.4 类
语法糖：在不改变功能和语法结构的前提下使代码更加简洁流畅，更加优雅。

ECMAScript 6 新引入的 class 关键字具有正式定义类的能力。类（class）是 ECMAScript 中新的基础性语法糖结构，因此刚开始接触时可能会不太习惯。虽然 ECMAScript 6 类表面 上看起来可以支持正式的面向对象编程，但实际上它背后使用的仍然是原型和构造函数的概念。

### 8.4.1 类定义
两种主要方式：类声明和类表达式
![46aba6bb85dad6e3b5aaa80af79de4fe.png](en-resource://database/2825:1)

和函数声明不同的地方是，函数受函数作用域限制，而类受块级作用域限制
![b9b95b367fb87f25f108f204c8464448.png](en-resource://database/2827:1)

### 8.4.2 类构造函数
#### 1. 实例化
![969adfb6921488a62e0b7c8369341d70.png](en-resource://database/2829:1)

类构造函数与构造函数的主要区别是，调用类构造函数必须使用 new 操作符。而普通构造函数如果 不使用 new 调用，那么就会以全局的 this（通常是 window）作为内部对象。调用类构造函数时如果 忘了使用 new 则会抛出错误：![11162168aaf979ccb3b37ac079581b1e.png](en-resource://database/2831:1)

#### 把类当成特殊函数

ECMAScript 中没有正式的类这个类型。从各方面来看，ECMAScript 类就是一种特殊函数。声明一 个类之后，通过 typeof 操作符检测类标识符，表明它是一个函数：
![80cb71aeb5fac4016dab71b71a41bc20.png](en-resource://database/2833:1)

类是 JavaScript 的一等公民，因此可以像其他对象或函数引用一样把类作为参数传递：
![7299c0d3d9f66b2cd177c7c191344211.png](en-resource://database/2835:1)

### 8.4.3 实例、原型和类成员

类的语法可以非常方便地定义应该存在于实例上的成员、应该存在于原型上的成员，以及应该存在 于类本身的成员。

#### 实例成员

每次通过new调用类标识符时，都会执行类构造函数。在这个函数内部，可以为新创建的实例（this） 添加“自有”属性。至于添加什么样的属性，则没有限制。另外，在构造函数执行完毕后，仍然可以给 实例继续添加新成员。 每个实例都对应一个唯一的成员对象，这意味着所有成员都不会在原型上共享
![34d14170a632017e05239de4f11fae5c.png](en-resource://database/2837:1)

#### 原型方法与访问器

为了在实例间共享方法，类定义语法把在类块中定义的方法作为原型方法。（**像构造函数中的添加到this的内容存在于不同的实例上，而在类块中定义的所有内容都会定义在类的原型上，这样可以实现复用**）![ccc1a1386707084640af665617dc5632.png](en-resource://database/2839:1)
![781a91e80589cfe4a29df0ca0ff36db2.png](en-resource://database/2841:1)

类方法等同于对象属性，因此可以使用字符串、符号或计算的值作为键：![51cc00a6fb8a931bc7c546fef4d3c300.png](en-resource://database/2843:1)

类定义也支持获取和设置访问器。语法与行为跟普通对象一样：
![89f5bcffc5751260fc175fa46884dac1.png](en-resource://database/2845:1)

#### 静态类方法

可以在类上定义静态方法。这些方法通常用于执行不特定于实例的操作，也不要求存在类的实例。![517290e21d246c5ab47e660f12994061.png](en-resource://database/2849:1)

#### 非函数原型和类成员
#### 迭代器与生成器方法

### 8.4.4 继承

本章前面花了大量篇幅讨论如何使用 ES5 的机制实现继承。ECMAScript 6 新增特性中最出色的一 个就是原生支持了类继承机制。虽然类继承使用的是新语法，但背后依旧使用的是原型链。

#### 继承基础

ES6 类支持单继承。使用 extends 关键字，就可以继承任何拥有[[Construct]]和原型的对象。 很大程度上，这意味着不仅可以继承一个类，也可以继承普通的构造函数（保持向后兼容）：
![fc359978160f128b0042bc4a5cf2de82.png](en-resource://database/2851:1)

派生类都会通过原型链访问到类和原型上定义的方法。this 的值会反映调用相应方法的实例或者类：![ff4fc4a393410d9cd45a429ed8895acd.png](en-resource://database/2853:4)
![280857a272d5f1037c1ab1b5efdb351d.png](en-resource://database/2855:2)![ff4fc4a393410d9cd45a429ed8895acd.png](en-resource://database/2853:4)
![280857a272d5f1037c1ab1b5efdb351d.png](en-resource://database/2855:2)
![ff4fc4a393410d9cd45a429ed8895acd.png](en-resource://database/2853:4)
![ff4fc4a393410d9cd45a429ed8895acd.png](en-resource://database/2853:4)


#### 构造函数、HomeObject 和 super()

派生类的方法可以通过 super 关键字引用它们的原型。这个关键字只能在派生类中使用，而且仅 限于类构造函数、实例方法和静态方法内部。在类构造函数中使用 super 可以调用父类构造函数。![f32967f8caf2c2ad2216f3867f31cfc7.png](en-resource://database/2857:1)
![308fdcf0d2f4a4677578f39db691a888.png](en-resource://database/2859:1)

#### 抽象基类
供其他类继承，但本身不会被实例化![d44e7585480e4da173d17e4968807e89.png](en-resource://database/2861:1)+----------------------------------------------------

#### 继承内置类型

ES6 类为继承内置引用类型提供了顺畅的机制，开发者可以方便地扩展内置类型
#### 类混入

把不同类的行为集中到一个类是一种常见的 JavaScript 模式。虽然 ES6 没有显式支持多类继承，但 通过现有特性可以轻松地模拟这种行为。
![babf3894b79aa1e672b88ba0ef6c69fe.png](en-resource://database/2865:1)

## 8.5 小结
![d4eb9abbc4620143698d4d04ef3d3298.png](en-resource://database/2909:1)
