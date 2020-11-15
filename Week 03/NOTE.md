# 使用LL算法构建AST
AST：抽象语法树
纯文本转换成AST分为两步：词法分析和语法分析
## 四则运算
- TokenNumber
0 1 2 3 4 5 6 7 8 9的组合
- Operator
+ - * / 之一
- whitespace
<SP>
- LineTerminator
<LF><CR>

## 词法分析

```js
function* tokenize (code) {
  const regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|([\*]+)|([\/]+)|([\+]+)|([\-]+)/g
  const dictionary = ["Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"]
  let result = null, lastIndex = 0
  while (true) {
    lastIndex = regexp.lastIndex
    result = regexp.exec(code)
    if (!result) break
    if (regexp.lastIndex - lastIndex > result[0].length) break

    let token = {
      type: null,
      value: null
    }

    for (let i = 1; i <= dictionary.length; i++) {
      if (result[i]) token.type = dictionary[i-1]
    }
    token.value = result[0]

    yield token
  }}

for (let token of tokenize("1024 + 10 * 25")) {
  console.log(token)}
```
## 语法分析
```js
    let source = [];

    for(let token of tokenize("1 + 2 * 5 + 3")){
        // console.log(token);
        if(token.type !== "Whitespace" && token.type !== "LineTerminator")
            source.push(token);
    }

    function Expression(tokens){
        if(source[0].type === "AdditiveExpression" && source[1] && source[1].type === "EOF"){
            let node = {
                type: "Expression",
                children: [source.shift(), source.shift()]
            }
            source.unshift(node);
            return node;
        }
        AdditiveExpression(source);
        return Expression(source);
    }

    //加减
    function AdditiveExpression(source){
        if(source[0].type === "MultiplicativeExpression"){
            let node = {
                type: "AdditiveExpression",
                children: [source[0]]
            }
            source[0] = node;
            return AdditiveExpression(source);
        }
        if(source[0].type === "AdditiveExpression" && source[1] && source[1].type === "*"){
            let node = {
                type: "MultiplicativeExpression",
                operator: "+",
                children: []
            }
            node.children.push(source.shift());
            node.children.push(source.shift());
            MultiplicativeExpression(source);
            node.children.push(source.shift());
            source.unshift(node);
            return AdditiveExpression(source);
        }
        if(source[0].type === "AdditiveExpression" && source[1] && source[1].type === "/"){
            let node = {
                type: "AdditiveExpression",
                operator: "-",
                children: []
            }
            node.children.push(source.shift());
            node.children.push(source.shift());
            MultiplicativeExpression(source);
            node.children.push(source.shift());
            source.unshift(node);
            return AdditiveExpression(source);
        }
        if(source[0].type === "AdditiveExpression"){
            return source[0];
        }
        MultiplicativeExpression(source);
        return AdditiveExpression(source);
    }

    //乘除
    function MultiplicativeExpression(source){
        if(source[0].type === "Number"){
            let node = {
                type: "MultiplicativeExpression",
                children: [source[0]]
            }
            source[0] = node;
            return MultiplicativeExpression(source);
        }
        if(source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "*"){
            let node = {
                type: "MultiplicativeExpression",
                operator: "*",
                children: []
            }
            node.children.push(source.shift());
            node.children.push(source.shift());
            node.children.push(source.shift());
            source.unshift(node);
            return MultiplicativeExpression(source);
        }
        if(source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "/"){
            let node = {
                type: "MultiplicativeExpression",
                operator: "/",
                children: []
            }
            node.children.push(source.shift());
            node.children.push(source.shift());
            node.children.push(source.shift());
            source.unshift(node);
            return MultiplicativeExpression(source);
        }
        if(source[0].type === "MultiplicativeExpression"){
            return source[0];
        }
        return MultiplicativeExpression(source);
    }

```
# 重学前端 模块一
# JavaScript类型
JavaScript模块从运行时、文法和执行过程三个角度剖析JS的知识体系
![39ede9e7f903bc429e0c5b57ab7947a5.png](en-resource://database/2488:1)

JavaScript其中数据类型：
- Undefined
- Null
- Boolean
- String
- Number
- Symbol（ES6新加入）
- Object

# 关于类型的几个基础问题
## Undefined、Null
**为什么有的编程规范要求用void 0 代替 undefined？**
Undefined类型表示未定义，他的类型只有一个值，就是undefined，一般我们可以用全局变量undefined（就是名为undefined的这个变量）来表达这个值，或者void运算来把一个表达式变成undefined值。
但是，JavaScript的代码undefined是一个变量，而不是一个关键字，所以为了避免被篡改，使用void 0 来代替 undefined

Null表示定义了但是为空

**我的理解：** undefined不是关键字，只是全局对象的一个属性，可以被重写
var undefined = 10；
void运算符能对给定的表达式进行求值，然后返回undefined（void后面随便一个表达式返回的都是undefined），最短的是void 0，且void不能被重写

## Boolean
类型有两个值，true和false用于表示逻辑意义上的真假，同样有关键字true和false来表示两个值

## String
String用于表示文本数据。最大长度是2^53-1，但这个长度不是我们所理解的字符数，因为String的意义不是‘字符串’而是字符串的UTF16编码

## Number
**注意：** 根据浮点数的定义，非整数的Number类型无法用 == （=== 也不行）来比较
![1e719705c9faadde655650d3d289397d.png](en-resource://database/2490:1)

## Symbol
是ES6引入的新类型（类似于字符串），他是一切非字符串的对象key的集合

## Object
在JavaScript中，对象的定义是‘属性的集合’。属性分为数据属性和访问器属性，二者都是key-value结构，key可以是字符串或者symbol类型

**为什么给对象添加的方法能用在基本类型上？**
回答：.运算符提供了装箱操作，他会根据基础类型构造一个临时对象，使我们能在基础类型上调用对应对象的方法

# JavaScript对象：面向对象还是基于对象
任何JavaScript对象其实是互不相等的
``js

    var o1 = { a: 1 };
    var o2 = { a: 1 };
    console.log(o1 == o2); // false
``
对象有三个特点：
- 对象具有唯一标识符：即使完全相同的两个对象也并非同一个对象（唯一标识的内存地址）
- 对象有状态：对象具有状态，同一个对象可能处于不同状态之下
- 对象具有行为：即对象的状态可能因为他的行为产生改变

在JavaScript中，将状态和行为统一抽象为‘属性’

# JavaScript对象：我们真的需要模拟类吗

## JavaScript的原型
- 如果所有对象都有私有字段[[prototype]]，就是对象的原型
- 读一个属性，如果对象本身没有，则会继续访问对象的原型，直到原型为空或者找到为止

# JavaScript对象：你知道全部的对象分类吗（不全）

理解这些对象的性质，才能真正理解我们使用的API的一些特性
## JavaScript中的对象分类
- 宿主对象：由JavaScript宿主环境提供的对象，他们的行为完全由宿主环境决定
- 内置对象：由JavaScript语言提供的对象
    - 固有对象：随着JavaScript运行时创建而自动创建的对象实例
    - 原生对象：可以由用户通过Array、RegExp等内置构造器或者特殊语法创建的对象
    - 普通对象：由{}语法、object构造器或者class关键字定义类创建的对象，他能够被原型继承

### 宿主对象
JavaScript宿主对象千奇百怪，但是前段最熟悉的无疑是浏览器环境中的宿主了

在浏览器环境中，我们知道全局对象是window，window上又有很多属性，如document。

实际上，这个全局对象window上的属性，一部分来自JavaScript语言，一部分来自浏览器环境

JavaScript标准中规定了全局对象属性，W3C的各种标准中规定了window对象的其他属性。

宿主对象也分为固有的和用户创建的两种，比如document.createElement就可以创建一些DOM对象

宿主也会提供一些构造器，比如我们可以使用new Image来创建img元素。

### 内置对象
#### 固有对象
在任何JavaScript代码执行前就已经被创建出来了，通常扮演类似基础库的角色。“类”就是固有对象的一种。

#### 原生对象
我们把 JavaScript 中，能够通过语言本身的构造器创建的对象称作原生对象。在 JavaScript 标准中，提供了 30 多个构造器。按照我的理解，按照不同应用场景，我把原生对象分成了以下几个种类。
![a1502b1f1a8e859bba2d915ab593010f.png](en-resource://database/2524:1)
通过这些构造器，我们可以用 new 运算创建新的对象，所以我们把这些对象称作原生对象。

**几乎所有这些构造器的能力都是无法用纯 JavaScript 代码实现的**，它们也无法用 class/extend 语法来继承。

这些构造器创建的对象多数使用了私有字段, 例如：
- Error: [[ErrorData]]
- Boolean:[[BooleanData]]
- Number: [[NumberData]]
- Date: [[DateValue]]
- RegExp: [[RegExpMatcher]]
- Symbol: [[SymbolData]]
- Map: [[MapData]]

这些字段使得原型继承方法无法正常工作，所以，我们可以认为，所有这些原生对象都是为了特定能力或者性能，而设计出来的“特权对象”。
