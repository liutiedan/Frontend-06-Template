## HTTP请求
**插播git报错**
git pull 时报错：error: Your local changes to the following files would be overwritten by merge:Week 05/模仿reactive实现原理.html
实验室传到github的版本与宿舍版本不一样

解决方法(以github版本为标准）
git reset --hard
git pull
### HTTP的协议解析
![7cc3b8ac99e999b175ea874bdac744d0.png](en-resource://database/3144:1)

#### TCP 与 IP 的一些基础知识
在 TCP 层传输数据的概念是流，对应端口，TCP 协议是被计算机中的软件所使用的，每一个软件都会从网卡中拿数据，具体哪一个数据包分配给哪一个软件需要用到端口，在 node 中依赖的库就是require('net')  （TCP是全双工通道：你可以给我发，我也可以给你发，不存在优先关系）

IP 根据地址找到包从哪到哪，IP 地址唯一的标识了连入 Internet 的每一个设备

#### HTTP
由 Request 和 Response 两个过程组成

##### 第一步 HTTP请求总结
- 设计一个 HTTP 请求的类
- content type 是一个必要的字段，要有默认值
- body 是 KV 格式
- 不同的 content-type 影响 body 的格式

##### 第二步 send 函数
- 在Request的构造器中收集必要的信息
- 设计一个send函数，把请求真是发送到服务器
- send函数应该是异步的，所以返回Promise

##### 第三步 发送请求
- 设计支持已有的 connection 或者自己新建 connection
- 收到数据传给 parser
-  根据 parser 的状态 resolve Promise

##### 第四步 ResponseParser 总结
- Response 必须分段构造，所以我们要用一个 ResponseParser来“装配”
- ResponseParser 分段处理 ResponseText，我们用状态机来分析文本的结构

##### 第五步 BodyParser 总结
- Response 的 body 可能根据 Content-Type 有不同的结构，因此我们采用子 Parser 的结构来解决问题
- 以 TrunkedBodyParser 为例，我们同样用状态机来处理body的格式

# 第十章 函数
**本章内容**
- 函数表达式、函数声明及箭头函数
- 默认参数及扩展操作符
- 使用函数实现递归
- 使用闭包实现私有变量

函数实际上是对象，函数名就是指向函数对象的指针

定义方式：
- 函数声明
```js
function sum (num1, num2) { return num1 + num2; }
```
- 函数表达式
```js
let sum = function(num1, num2) { return num1 + num2; };
```
- 箭头函数
```js
let sum = (num1, num2) => { return num1 + num2; };
```

## 10.1 箭头函数
// 无效的写法：
let multiply = (a, b) => return a * b;

箭头函数虽然语法简洁，但也有很多场合不适用。箭头函数不能使用 arguments、super 和 new.target，也不能用作构造函数。此外，箭头函数也没有 prototype 属性。

## 函数名

因为函数名就是指向函数的指针，所以它们跟其他包含对象指针的变量具有相同的行为。这意味着 一个函数可以有多个名称
**函数名只是指向这个函数**

ECMAScript 6 的所有函数对象都会暴露一个只读的 name 属性，其中包含关于函数的信息。多数情 况下，这个属性中保存的就是一个函数标识符，或者说是一个字符串化的变量名。即使函数没有名称， 也会如实显示成空字符串。如果它是使用 Function 构造函数创建的，则会标识成"anonymous"：
![244b070d3c16bcf0dd5ba31f2fc653a4.png](en-resource://database/2915:1)

如果函数是一个获取函数、设置函数，或者使用 bind()实例化，那么标识符前面会加上一个前缀：
![bdd66f787470bb3e7f3b4d6538fa8dec.png](en-resource://database/2917:1)

## 10.3 理解参数
arguments是一个数组，传入的参数都在这个数组里

虽然箭头函数中没有 arguments 对象，但可以在包装函数中把它提供给箭头函数：
![7d11d980d5a3db118fd8e56e96627291.png](en-resource://database/2919:1)

**注意 ECMAScript 中的所有参数都按值传递的。不可能按引用传递参数。如果把对象作 为参数传递，那么传递的值就是这个对象的引用。**

## 10.4 没有重载
其他语言如java只要签名（接收参数的类型和数量）不同就行。但是如前所述，ECMAscript函数没有签名，因为参数是由数组表示的，自然也就没有重载

## 10.5 默认参数值

ECMAScript 6 之后支持显式定义默认参数
![64eaf19a23bf8dbc2b5895c30744059b.png](en-resource://database/2921:1)

在使用默认参数时，arguments 对象的值不反映参数的默认值，只反映传给函数的参数。

默认参数值并不限于原始值或对象类型，也可以使用调用函数返回的值：
![01fd9bba7a5dbe06c3aaf547f9565c22.png](en-resource://database/2923:1)
![f78c2153b907605362426d63a8318350.png](en-resource://database/2925:1)

给多个参数定义默认值实际上跟使用 let 关键字顺序声明变量一样。
因为参数是按顺序初始化的，所以后定义默认值的参数可以引用先定义的参数。

## 10.6 参数扩展与收集

ECMAScript 6 新增了扩展操作符，使用它可以非常简洁地操作和组合集合数据。扩展操作符最有用 的场景就是函数定义中的参数列表，在这里它可以充分利用这门语言的弱类型及参数长度可变的特点。 扩展操作符既可以用于调用函数时传参，也可以用于定义函数参数。

### 10.6.1 扩展参数
如果不使用扩 展操作符，想把定义在这个函数这面的数组拆分，那么就得求助于 apply()方法：
```js
console.log(getSum.apply(null, values)); // 10
```

使用扩展操作符可以将前面例子中的数组像这样直接传给函数：
```js
console.log(getSum(...values)); // 10
```

### 10.6.2 收集参数

收集参数的前面如果还有命名参数，则只会收集其余的参数；如果没有则会得到空数组。因为收集 参数的结果可变，所以只能把它作为最后一个参数：
![9bee8e83f5735f172d1c5d042f22c578.png](en-resource://database/2927:1)

箭头函数虽然不支持 arguments 对象，但支持收集参数的定义方式，因此也可以实现与使用 arguments 一样的逻辑：
![ea11d831cc594d9a82af391da52080f3.png](en-resource://database/2929:1)

### 10.7 函数声明和函数表达式

本章到现在一直没有把函数声明和函数表达式区分得很清楚。事实上，JavaScript 引擎在加载数据 时对它们是区别对待的。JavaScript 引擎在任何代码执行之前，会先读取函数声明，并在执行上下文中 生成函数定义。而函数表达式必须等到代码执行到它那一行，才会在执行上下文中生成函数定义。来看 下面的例子：
![7b21a23574ca45f436d60e59a786f1f8.png](en-resource://database/2931:1)

以上代码可以正常运行，因为函数声明会在任何代码执行之前先被读取并添加到执行上下文。这个 过程叫作**函数声明提升**（function declaration hoisting）。在执行代码时，JavaScript 引擎会先执行一遍扫描， 把发现的函数声明提升到源代码树的顶部。因此即使函数定义出现在调用它们的代码之后，引擎也会把 函数声明提升到顶部。如果把前面代码中的函数声明改为等价的函数表达式，那么执行的时候就会出错：
![29d34d8e383b5d32ee5475b04bd884ae.png](en-resource://database/2933:1)

上面的代码之所以会出错，是因为这个函数定义包含在一个变量初始化语句中，而不是函数声明中。 这意味着代码如果没有执行到加粗的那一行，那么执行上下文中就没有函数的定义，所以上面的代码会 出错。这并不是因为使用 let 而导致的，使用 var 关键字也会碰到同样的问题

## 10.8 函数作为值
函数名在ECMAscript中就是变量，意味着不仅可以把参数当变量创给一个函数，还可以在一个函数中返回另一个函数。
![20e5dddb8986d89b7d3eb2a91fdc23a7.png](en-resource://database/2935:1)

## 10.9 函数内部

在 ECMAScript 5 中，函数内部存在两个特殊的对象：arguments 和 this。ECMAScript 6 又新增 了 new.target 属性。

### 10.9.1 arguments

个对象只有以 function 关键字定义函数（相对于使用箭头语法创建函数）时才会有。

虽然主要用于包 含函数参数，但 arguments 对象其实还有一个 callee 属性，是一个指向 arguments 对象所在函数的指针
经典阶乘函数写法：
![963f0a7b403d641107420ee52ca98014.png](en-resource://database/2937:1)

这个函数要正确执行就必须保证函数名是 factorial，从而导致 了紧密耦合。使用 arguments.callee 就可以让函数逻辑与函数名解耦
![7f9c47130319451b89d98c8425fd5fdc.png](en-resource://database/2939:1)

这个重写之后的 factorial()函数已经用 arguments.callee 代替了之前硬编码的 factorial。 这意味着无论函数叫什么名称，都可以引用正确的函数。考虑下面的情况：
![de8555637da3146539bb39167da73393.png](en-resource://database/2941:1)

### 10.9.2 this

另一个特殊的对象是 this，它在标准函数和箭头函数中有不同的行为。

在标准函数中，this 引用的是**把函数当成方法调用的上下文对象**，这时候通常称其为 this 值（在 网页的全局上下文中调用函数时，this 指向 windows）。
![0d7f6b77f87d793828daa77e3fa45774.png](en-resource://database/2943:1)

定义在全局上下文中的函数 sayColor()引用了 this 对象。这个 this 到底引用哪个对象必须到 函数被调用时才能确定。因此这个值在代码执行的过程中可能会变。如果在全局上下文中调用 sayColor()，这结果会输出"red"，因为 this 指向 window，而 this.color 相当于 window.color。 而在把 sayColor()赋值给 o 之后再调用 o.sayColor()，this 会指向 o，即 this.color 相当于 o.color，所以会显示"blue"。

在箭头函数中，this引用的是**定义箭头函数的上下文**。下面的例子演示了这一点。在对sayColor() 的两次调用中，this 引用的都是 window 对象，因为这个箭头函数是在 window 上下文中定义的：
![4f6760a63a33167d9933a5616f435c92.png](en-resource://database/2945:1)

有读者知道，在事件回调或定时回调中调用某个函数时，this 值指向的并非想要的对象。此时将 回调函数写成箭头函数就可以解决问题。这是因为箭头函数中的 this 会保留定义该函数时的上下文：
![8aaa989c4a213512b4c6a601ca4a7cc8.png](en-resource://database/2947:1)
![e9c7c19a56e4bb1caf24148850f25483.png](en-resource://database/2949:1)

**注意 函数名只是保存指针的变量。因此全局定义的 sayColor()函数和 o.sayColor() 是同一个函数，只不过执行的上下文不同。**

### 10.9.3 caller

ECMAScript 5 也会给函数对象上添加一个属性：caller。虽然 ECMAScript 3 中并没有定义，但所 有浏览器除了早期版本的 Opera 都支持这个属性。这个属性引用的是调用当前函数的函数，或者如果是 在全局作用域中调用的则为 null。比如：

### 10.9.4 new.target

ECMAScript 中的函数始终可以作为构造函数实例化一个新对象，也可以作为普通函数被调用。 ECMAScript 6 新增了检测函数是否使用 new 关键字调用的 new.target 属性。如果函数是正常调用的，则 new.target 的值是 undefined；如果是使用 new 关键字调用的，则 new.target 将引用被调用的 构造函数。
![14e448b5f434919df1ec03418e22de22.png](en-resource://database/2951:1)

## 10.10 函数属性与方法

前面提到过，ECMAScript 中的函数是对象，因此有属性和方法。每个函数都有两个属性：length 和 prototype。其中，**length 属性保存函数定义的命名参数的个数**

prototype 属性也许是 ECMAScript 核心中最有趣的部分。prototype 是保存引用类型所有实例 方法的地方，这意味着 toString()、valueOf()等方法实际上都保存在 prototype 上，进而由所有实 例共享。这个属性在自定义类型时特别重要。（相关内容已经在第 8 章详细介绍过了。）在 ECMAScript 5 中，prototype 属性是不可枚举的，因此使用 for-in 循环不会返回这个属性。

函数还有两个方法：apply()和 call()。这两个方法都会以指定的 this 值来调用函数，即**会设 置调用函数时函数体内 this 对象的值**。apply()方法接收两个参数：函数内 this 的值和一个参数数 组。第二个参数可以是 Array 的实例，但也可以是 arguments 对象。
![9eb243ed72b3aac774bdd2b533fa99d3.png](en-resource://database/2953:1)
![4e1851bb89c75985e3ffccadc6bce2ab.png](en-resource://database/2955:1)

在这个例子中，callSum1()会调用 sum()函数，将 this 作为函数体内的 this 值（这里等于 window，因为是在全局作用域中调用的）传入，同时还传入了 arguments 对象。callSum2()也会调 用 sum()函数，但会传入参数的数组。这两个函数都会执行并返回正确的结果。
**注意 在严格模式下，调用函数时如果没有指定上下文对象，则 this 值不会指向 window。 除非使用 apply()或 call()把函数指定给一个对象，否则 this 的值会变成 undefined。**

call()方法与 apply()的作用一样，只是传参的形式不同。第一个参数跟 apply()一样，也是 this 值，而剩下的要传给被调用函数的参数则是逐个传递的。换句话说，通过 call()向函数传参时，必须 将参数一个一个地列出来，比如：
![da0097570c912941d9ff7f1b54a457a1.png](en-resource://database/2957:1)

到底是 使用 apply()还是 call()，完全取决于怎么给要调用的函数传参更方便。如果想直接传 arguments 对象或者一个数组，那就用 apply()；否则，就用 call()。当然，如果不用给被调用的函数传参，则 使用哪个方法都一样。

apply()和 call()真正强大的地方并不是给函数传参，而是控制函数调用上下文即函数体内 this 值的能力。
![b7bb5b3585f762e08d4988588836d735.png](en-resource://database/2959:1)

使用 call()或 apply()的好处是可以将任意对象设置为任意函数的作用域，这样对象可以不用关 心方法。

**ECMAScript 5 出于同样的目的定义了一个新方法：bind()。bind()方法会创建一个新的函数实例，
其 this 值会被绑定到传给 bind()的对象。**
![e7603daa4318726a36a6edc8526df8e9.png](en-resource://database/2961:1)

## 10.11 函数表达式
## 10.12 递归

递归函数通常的形式是一个函数通过名称调用自己，如下面的例子所示：
![80828e4f0af5faa289367b41e0bfc24b.png](en-resource://database/2963:1)
之前是用arguments.callee将递归函数名与函数逻辑进行解耦
![0a60a55a6bc30d3cb0a772887ab7103e.png](en-resource://database/2965:1)

不过，在严格模式下运行的代码是不能访问 arguments.callee 的，因为访问会出错。此时，可 以使用命名函数表达式（named function expression）达到目的。
![acff6e91e8e8f804bd3d2a88ff05bb9d.png](en-resource://database/2967:1)

这里创建了一个命名函数表达式 f()，然后将它赋值给了变量 factorial。即使把函数赋值给另 一个变量，函数表达式的名称 f 也不变，因此递归调用不会有问题。这个模式在严格模式和非严格模式 下都可以使用。

## 10.13尾调用优化（没看）
## 10.14 闭包（没看p334）
## 10.15 立即调用的函数表达式

立即调用的匿名函数又被称作立即调用的函数表达式。它类似于函数声明，但由于被包含在括号中，所以会被解释为函数表达式。紧
```js
(function() { // 块级作用域 })();
```

使用 IIFE 可以模拟块级作用域，即在一个函数表达式内部声明变量，然后立即调用这个函数。这 样位于函数体作用域的变量就像是在块级作用域中一样。ECMAScript 5 尚未支持块级作用域，使用 IIFE 模拟块级作用域是相当普遍的。
![b67bb8a109b1eac4f414d35b02061c5e.png](en-resource://database/2969:1)

ECMAScript 6 以后，IIFE 就没有那么必要了，因为块级作用域中的变量无须 IIFE 就可以实现同 样的隔离。下
![9ff3b5e1df0faee6680963cb2efdd72e.png](en-resource://database/2971:1)

**说明 IIFE 用途的一个实际的例子，就是可以用它锁定参数值。比如：**
![e1d3666f4d2f46a24228e9ca3636a4f9.png](en-resource://database/2973:1)

这里使用 var 关键字声明了循环迭代变量 i，但这个变量并不会被限制在 for 循环的块级作用域内。 因此，渲染到页面上之后，点击每个<div>都会弹出元素总数。这是因为在执行单击处理程序时，迭代变 量的值是循环结束时的最终值，即元素的个数。而且，这个变量 i 存在于循环体外部，随时可以访问。 

以前，为了实现点击第几个
就显示相应的索引值，需要借助 IIFE 来执行一个函数表达式，传 入每次循环的当前索引，从而“锁定”点击时应该显示的索引值：
![1048d0bcbf70656013c60c2c927b7ecc.png](en-resource://database/2975:1)

而使用 ECMAScript 块级作用域变量，就不用这么大动干戈了
![de4053255389677a8f1e7ce700058ff3.png](en-resource://database/2977:1)
![959ff0c527a429f09f73105fbacd5f94.png](en-resource://database/2979:1)

这样就可以让每次点击都显示正确的索引了。这里，事件处理程序执行时就会引用 for 循环块级作 用域中的索引值。这是因为在 ECMAScript 6 中，如果对 for 循环使用块级作用域变量关键字，在这里 就是 let，那么循环就会为每个循环创建独立的变量，从而让每个单击处理程序都能引用特定的索引。

## 10.16 私有变量（没看）

## 10.17 小结
![ecbc6c4789cbbfb6686de1d797004e46.png](en-resource://database/2981:1)
