# Week 5 Proxy与双向绑定
## proxy
Proxy对象用于修改某些操作的默认行为

可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问过滤和改写。（由他来代理某些操作）

ES6原生提供Proxy构造函数，用来生成Proxy实例
```js
var proxy = new Proxy(target, handler);
```
new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

## 双向绑定
reactive是一个数据监听器，通过new Proxy的get和set方法实现双向绑定

### Model->View
```js
<input id="input"><script>
    let obj = {
        a: 1
    }
    let callbacks = [];

    callbacks.push(() => {
        document.getElementById('input').value = obj.a;
    })

    let po = new Proxy(obj, {
        set(target, props, value) {
            for (let callback of callbacks) {
                callback(value);
            }
        }
    })
    po.a = 4;</script>
```
每当通过set设置值时，执行回调函数，显示在页面上

### View->Model
```js
document.getElementById("input").addEventListener("input", (e) => {
        po.a = e.target.value;
    });
```
监听input框发生的变化，将值赋予po

## Range
#### 创建Range对象
var range = document.createRange();
#### 操作range对象
设置起点位置：setStart(node, offset)
设置终点位置：setEnd（node，offset）

getBoundingClientRect()方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。

获取与当前鼠标拖拽位置最近的范围
```js
function getNearest(x, y){
        let min = Infinity;
        let nearest = null;
        for(let range of ranges){
            let rect = range.getBoundingClientRect();
            let distance = (rect.x - x) **2 + (rect.y - y) **2;
            if(distance < min){
                nearest = range;
                min = distance;
            }
        }
        return nearest;
    }
```

# 第七章 迭代器与生成器
#### 本章内容
- 理解迭代
- 迭代器模式
- 生成器

迭代的英文“iteration”。ECMAScript 6 规范新增了两个高 级特性：迭代器和生成器。使用这两个特性，能够更清晰、高效、方便地实现迭代。

## 7.1 理解迭代
循环是迭代机制的基础；
迭代会在一个有序集合上进行（数组时JavaScript中有序集合最经典例子）

## 7.2 迭代器模式
迭代器是按需创建的一次性对象；每个迭代器都会关联一个可迭代对象。

### 7.2.1 可迭代协议
实现 Iterable 接口（可迭代协议）要求同时具备两种能力：支持迭代的自我识别能力和创建实现 Iterator 接口的对象的能力。在 ECMAScript 中，这意味着必须暴露一个属性作为“默认迭代器”，而 且这个属性必须使用特殊的 Symbol.iterator 作为键。这个默认迭代器属性必须引用一个迭代器工厂 函数，调用这个工厂函数必须返回一个新迭代器。

很多内置类型都实现了 Iterable 接口： 
- 字符串 
- 数组 
- 映射 
- 集合 
- arguments 对象 
- NodeList 等 DOM 集合类型

检查是否存在默认迭代器属性可以暴露这个工厂函数：
```js
let num = 1; let obj = {}; 
// 这两种类型没有实现迭代器工厂函数 
console.log(num[Symbol.iterator]); // undefined 
console.log(obj[Symbol.iterator]); // undefined 
let str = 'abc';
let arr = ['a', 'b', 'c'];
let map = new Map().set('a', 1).set('b', 2).set('c', 3); 
let set = new Set().add('a').add('b').add('c'); 
let els = document.querySelectorAll('div'); 

// 这些类型都实现了迭代器工厂函数 
console.log(str[Symbol.iterator]); // f values() { [native code] } 
console.log(arr[Symbol.iterator]); // f values() { [native code] } 
console.log(map[Symbol.iterator]); // f values() { [native code] } 
console.log(set[Symbol.iterator]); // f values() { [native code] } 
console.log(els[Symbol.iterator]); // f values() { [native code] } 

// 调用这个工厂函数会生成一个迭代器 
console.log(str[Symbol.iterator]()); // StringIterator {} 
console.log(arr[Symbol.iterator]()); // ArrayIterator {} 
console.log(map[Symbol.iterator]()); // MapIterator {} 
console.log(set[Symbol.iterator]()); // SetIterator {} 
console.log(els[Symbol.iterator]()); // ArrayIterator {}
```

实际写代码过程中，不需要显式调用这个工厂函数来生成迭代器。实现可迭代协议的所有类型都会 自动兼容接收可迭代对象的任何语言特性。接收可迭代对象的原生语言特性包括：
- for-of 循环 
- 数组解构 
- 扩展操作符 
- Array.from() 
- 创建集合
- 创建映射 
- Promise.all()接收由期约组成的可迭代对象 
- Promise.race()接收由期约组成的可迭代对象 
- yield* 操作符，在生成器中使用

这些原生语言结构会在后台调用提供的可迭代对象的这个工厂函数，从而创建一个迭代器：
```js
let arr = ['foo', 'bar', 'baz']; 

// for-of 循环 
for (let el of arr) { console.log(el); } 
// foo 
// bar 
// baz 

// 数组解构 
let [a, b, c] = arr; console.log(a, b, c); 
// foo, bar, baz 

// 扩展操作符 
let arr2 = [...arr]; console.log(arr2); 
// ['foo', 'bar', 'baz'] 

// Array.from() 
let arr3 = Array.from(arr); 
console.log(arr3); 
// ['foo', 'bar', 'baz'] 

// Set 构造函数 
let set = new Set(arr); 
console.log(set); 
// Set(3) {'foo', 'bar', 'baz'} 

// Map 构造函数 
let pairs = arr.map((x, i) => [x, i]); 
console.log(pairs); 
// [['foo', 0], ['bar', 1], ['baz', 2]] 

let map = new Map(pairs); 
console.log(map); 
// Map(3) { 'foo'=>0, 'bar'=>1, 'baz'=>2 } 

如果对象原型链上的父类实现了 Iterable 接口，那这个对象也就实现了这个接口： 
class FooArray extends Array {}
let fooArr = new FooArray('foo', 'bar', 'baz');
for (let el of fooArr) { console.log(el); } 
// foo
// bar 
// baz
```
### 7.2.2 迭代器协议
迭代器是一种一次性使用的对象，用于迭代与其关联的可迭代对象。迭代器 API 使用 next()方法 在可迭代对象中遍历数据。每次成功调用 next()，都会返回一个 IteratorResult 对象，其中包含迭 代器返回的下一个值。若不调用 next()，则无法知道迭代器的当前位置。

next()方法返回的迭代器对象 IteratorResult 包含两个属性：done 和 value。done 是一个布 尔值，表示是否还可以再次调用 next()取得下一个值；value 包含可迭代对象的下一个值（done 为 false），或者 undefined（done 为 true）。done: true 状态称为“耗尽”。可以通过以下简单的数 组来演示：
```js
// 可迭代对象 
let arr = ['foo', 'bar']; 

// 迭代器工厂函数 
console.log(arr[Symbol.iterator]); // f values() { [native code] } 

// 迭代器
let iter = arr[Symbol.iterator](); 
console.log(iter); // ArrayIterator {} 

// 执行迭代 
console.log(iter.next()); // { done: false, value: 'foo' } 
console.log(iter.next()); // { done: false, value: 'bar' } 
console.log(iter.next()); // { done: true, value: undefined }
```

“迭代器”的概念有时候容易模糊，因为它可以指通用的迭代，也可以指接口，还可以指正式的迭 代器类型。下面的例子比较了一个显式的迭代器实现和一个原生的迭代器实现。
```js
// 这个类实现了可迭代接口（Iterable） 
// 调用默认的迭代器工厂函数会返回 
// 一个实现迭代器接口（Iterator）的迭代器对象 
class Foo {
    [Symbol.iterator]() { 
        return { 
            next() { 
                return { done: false, value: 'foo' };
            } 
         } 
    } 
} 
let f = new Foo(); 

// 打印出实现了迭代器接口的对象 
console.log(f[Symbol.iterator]()); // { next: f() {} } 

// Array 类型实现了可迭代接口（Iterable） 
// 调用 Array 类型的默认迭代器工厂函数
// 会创建一个 ArrayIterator 的实例 
let a = new Array(); 
// 打印出 ArrayIterator 的实例 
console.log(a[Symbol.iterator]()); // Array Iterator {}
```

### 7.2.3 自定义迭代器
### 7.2.4 提前终止迭代器
## 7.3 生成器
生成器是 ECMAScript 6 新增的一个极为灵活的结构，拥有在一个函数块内暂停和恢复代码执行的 能力。这种新能力具有深远的影响，比如，使用生成器可以自定义迭代器和实现协程。

### 7.3.1 生成器基础
**生成器的形式是一个函数，函数名称前面加一个星号（ * ）表示它是一个生成器。只要是可以定义 函数的地方，就可以定义生成器。**
```js
// 生成器函数声明 
function* generatorFn() {} 

// 生成器函数表达式 
let generatorFn = function* () {} 

// 作为对象字面量方法的生成器函数 
let foo = { * generatorFn() {} } 

// 作为类实例方法的生成器函数 
class Foo { * generatorFn() {} } 

// 作为类静态方法的生成器函数 
class Bar { static * generatorFn() {} }
```
**箭头函数不能用来定义生成器函数**
