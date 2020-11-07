学习笔记
# week 2
## 广度优先搜索算法
**queue是搜索算法的灵魂**
JavaScript数组是一个天然的队列/栈
因为有
shift unshift
push pop（栈）
两组方法
如果shift和push一块用就是队列，unshift和pop也是队列

## 主要思想
在第一遍循环的时候就把start周围的四个节点加进队列（queue），然后逐个地把队列里面点周围的节点都加入队列中
**如果数组queue改名为stack，push和shift方法改成push和pop那就是深度优先搜索**

寻找路径：把map上标2的过程改成标他的前驱节点
比如：执行8这个点的时候，把2这个点的坐标写到8的位置
![db1e0f45ff0cc31b48034c7de554820e.png](en-resource://database/1447:1)

## 异步编程
```js
function sleep(t){
    return new Promise(function(resolve){
        setTimeout(resolve,t)
    }) 
}
