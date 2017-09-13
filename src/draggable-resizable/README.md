API

props |类型 | 描述
--- | --- |---
default | Object ({ x: number; y: number; width: number; height: number; })| width和height设置组件的默认宽高，x和y设置组件的默认位置
className | string |设置resizable组件的类
style | string |设置resizable组件的样式
width | number/string |设置resizable组件的初始width,如:300, '300px', 50%
height | number/string |设置resizable组件的height
minWidth | number |设置resizable组件的minWidth
minHeight | number |设置resizable组件的minHeight
maxWidth | number |设置resizable组件的maxWidth
maxHeight | number |设置resizable组件的maxHeight
z | number |设置组件的z-index
resizeGrid | array |调整时应该捕捉到的增量。默认[1,1]
dragGrid | array |移动时应该捕捉到的增量
lockAspectRatio | boolean |锁定宽高比
dragHandlerClassName | string |拖动的句柄的类
lockAspectRatio | boolean |锁定宽高比
resizeHandlerStyles | styles |用于覆盖一个或多个resize处理程序的样式，只有您指定的轴才会替换其处理程序样式，
resizeHandlerClasses | className |设置一个或多个resize处理程序的className
enableResizing | object |top, right, bottom, left, topRight, bottomRight, bottomLeft, topLeft 这几个方向
disableDragging | boolean |允许拖拽
extendsProps | any |传递其他属性到组件
dragAxis | string |允许拖拽的方向，"x","y","both","none"
bounds | any |移动界限。"parent" 或者类选择器
onResizeStart | func |开始调整回调
onResize | func |调整回调
onResizeStop | func |停止调整回调
onDragStart | func |开始拖动回调
onDrag | func |拖动回调
onDragStop | func |停止拖动回调
