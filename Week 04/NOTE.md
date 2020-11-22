# 字符串分析算法
字典树
    - 大量高重复字符串的存储与分析
KMP
    - 在长字符串里找模式
Wildcard
    - 带通配符的字符串模式
正则
    - 字符串通用模式匹配
状态机
    - 通用的字符串分析
LLLR
    - 字符串多层级结构分析
    
## 字典树
![c19256abb91c14e0517e20a638e74ab5.png](en-resource://database/2552:1)
典型应用是用于统计和排序大量的字符串（但不限于字符串）
#### 核心思想
空间换时间。利用字符串的公共前缀来降低查询时间的开销以达到提高效率的目的。

#### 基本性质
- 根节点不包含字符，除根节点外每一个节点只包含一个字符
- 从根节点到某一个节点，路径上经过的字符连接起来，为该节点对应的字符串。
- 每个节点的所有子节点包含的字符都不相同

## KMP
**字符串模式匹配**
给定两个字符串a,b，在主串a中寻找子串b的过程

KMP是一种改进的模式匹配算法
#### 改进之处
先根据子串，算出一张“部分匹配表”然后利用已经部分匹配的有效信息，使得在匹配过程中指针不回溯，尽可能移动到有效位置

## Wildcard
加入了两种通配符：*和？

- 乘号：匹配任意多个字符（前面的*尽量少的匹配，最后一个尽量多的匹配）

- ？：匹配任意一个字符

思路：
1. 找出 * 的个数
2. 如果=0，字符串要完全匹配；
3. 如果>0，开头和结尾需完全匹配，中间部分使用正则表达式，每一个 * 之前的部分都是一个子串，记录匹配上的位置lastIndex，并从此位置继续匹配下一个 * 的部分。

# 红宝书
# 第六章 集合引用类型
**本章内容**
- 对象
- 数组与定型数组
- Map、weakMap、Set以及WeakSet类型

## 6.1 object
object很适合存储和在应用程序间交换数据
两种创建object实例的方法：
1. new操作符
```js
let person = new Object(); 
person.name = "Nicholas"; 
person.age = 29;
```
2. 使用对象字面量表示法
对象字面量是对象定义的简写形式
```js
let person = { name: "Nicholas", age: 29 };
```
**表达式上下文指的是期待返回值的上下文**
**语句上下文（if。。。。）**
**注意：在使用对象字面量表示法定义对象时，并不会实际调用Object构造函数**

## 6.2 Array
### 6.2.1 创建数组
基本
1. 使用array构造函数
let colors = new Array();（也可省略new）
2. let colors = new Array(20);
3. let colors = new Array("red", "blue", "green");
数组字面量
let colors = ["red", "blue", "green"];
##### ES6新加
Array 构造函数还有两个 ES6 新增的用于创建数组的静态方法：from()和 of()。

from()用于将 类数组结构转换为数组实例

 of()用于将一组参数转换为数组实例。
 
##### Array.from（）
```js
// 字符串会被拆分为单字符数组 
console.log(Array.from("Matt")); // ["M", "a", "t", "t"]

// 可以使用 from()将集合和映射转换为一个新数组 
const m = new Map().set(1, 2) .set(3, 4); 
const s = new Set().add(1) .add(2) .add(3) .add(4);
console.log(Array.from(m)); // [[1, 2], [3, 4]] console.log(Array.from(s)); // [1, 2, 3, 4]
```
**如果已经是数组则进行浅拷贝（==返回false）**
Array.from()还接收第二个可选的映射函数参数。这个函数可以直接增强新数组的值，而无须像 调用 Array.from().map()那样先创建一个中间数组。还可以接收第三个可选参数，用于指定映射函 数中 this 的值。但这个重写的 this 值在箭头函数中不适用。
```js
const a1 = [1, 2, 3, 4]; 
const a2 = Array.from(a1, x => x**2); 
const a3 = Array.from(a1, function(x) {return x**this.exponent}, {exponent: 2}); 
console.log(a2); // [1, 4, 9, 16] 
console.log(a3); // [1, 4, 9, 16]
```
 ##### Array of（）
 
Array.of()可以把一组参数转换为数组。这个方法用于替代在 ES6之前常用的 Array.prototype. slice.call(arguments)，一种异常笨拙的将 arguments 对象转换为数组的写法：
```js
console.log(Array.of(1, 2, 3, 4)); // [1, 2, 3, 4] 
console.log(Array.of(undefined)); // [undefined]
```

### 6.2.2 数组空位
ES6之前，使用数组字面量初始化数组时，可以使用一串逗号来创建空位，ES6新增的方法和迭代器与早期版本不同，普遍将这些空位当成存在的元素，只不过值为undefined

ES6 之前的方法则会忽略这个空位，但具体的行为也会因方法而异：
```js
const options = [1,,,,5]; 
// map()会跳过空位置 
console.log(options.map(() => 6)); // [6, undefined, undefined, undefined, 6] 
// join()视空位置为空字符串 
console.log(options.join('-')); // "1----5"
```

### 6.2.3 数组索引
通过设置数组的length值可以添加或删除数组元素个数（删除的是末尾元素）

### 6.2.4 检测数组
```js
if (Array.isArray(value)){ 
    // 操作数组 }
```

### 6.2.5 迭代器方法

在 ES6 中，Array 的原型上暴露了 3 个用于检索数组内容的方法：keys()、values()和 entries()。keys()返回数组索引的迭代器，values()返回数组元素的迭代器，而 entries()返回 索引/值对的迭代器：
```js

const a = ["foo", "bar", "baz", "qux"]; 
// 因为这些方法都返回迭代器，所以可以将它们的内容
// 通过 Array.from()直接转换为数组实例 
const aKeys = Array.from(a.keys()); 
const aValues = Array.from(a.values());
const aEntries = Array.from(a.entries()); 
console.log(aKeys); // [0, 1, 2, 3] 
console.log(aValues); // ["foo", "bar", "baz", "qux"] 
console.log(aEntries); // [[0, "foo"], [1, "bar"], [2, "baz"], [3, "qux"]]
```
使用 ES6 的解构可以非常容易地在循环中拆分键/值对：
```js
for (const [idx, element] of a.entries()) { 
alert(idx); 
alert(element); 
} 
// 0
// foo 
// 1 
// bar 
// 2 
// baz 
// 3 
// qux
```
### ......

### 6.2.10 排序方法
默认情况下，sort()会按照升序重新排列数组元素，即最小的值在前面，最大的值在后面。为此， sort()会在每一项上调用 String()转型函数，然后比较字符串来决定顺序。即使数组的元素都是数值， 也会先把数组转换为字符串再比较、排序。比如：
```js
let values = [0, 1, 5, 10, 15]; 
values.sort(); 
alert(values); // 0,1,10,15,5
```
一开始数组中数值的顺序是正确的，但调用 sort()会按照这些数值的字符串形式重新排序。因此， 即使 5 小于 10，但字符串"10"在字符串"5"的前头，所以 10 还是会排到 5 前面。很明显，这在多数情 况下都不是最合适的。为此，sort()方法可以接收一个比较函数，用于判断哪个值应该排在前面。

比较函数接收两个参数，如果第一个参数应该排在第二个参数前面，就返回负值；如果两个参数相 等，就返回 0；如果第一个参数应该排在第二个参数后面，就返回正值。下面是使用简单比较函数的一 个例子：
```js
function compare(value1, value2) { 
if (value1 < value2) { 
return -1; 
} else if (value1 > value2) { 
return 1;
} else { 
return 0; 
} }
```
这个比较函数可以适用于大多数数据类型，可以把它当作参数传给 sort()方法，如下所示：
```js
let values = [0, 1, 5, 10, 15]; 
values.sort(compare); 
alert(values); // 0,1,5,10,15
```
