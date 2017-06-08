var data=null,//保存4x4个数据的二维数组
    RN=4,CN=4,//保存总行数和总列数
    score=0,//保存游戏得分
    status=0,//保存游戏状态编号
    //为游戏状态编号起名
    GAMEOVER=0,RUNNING=1;
//启动游戏
function start(){
  //初始化游戏状态为运行中
  status=RUNNING;
  score=0;//将分数归0
  data=[];//创建空数组保存在data中
  //将data初始化为4x4个0的二维数组
  for(var r=0;r<RN;r++){
    data.push([]);
    for(var c=0;c<CN;c++)
      data[r][c]=0;
  }
  //生成2个随机数
  randomNum(); randomNum();
  //更新页面
  updateView();
  //为页面绑定键盘按下事件处理函数
  //  ——回调函数
  document.onkeydown=function(e){
    //判断键盘号
    switch(e.keyCode){
      case 37://左
        moveLeft();
        break;
      case 38://上
        moveUp();
        break;
      case 39://右
        moveRight();
        break;
      case 40://下
        break;
    }
  }
}
//随机位置生成数
function randomNum(){
  while(true){//反复:
    //随机生成0~RN-1行号r
    var r=parseInt(Math.random()*RN);
    //随机生成0~CN-1列号c
    var c=parseInt(Math.random()*CN);
    //如果data中r行c列的值为0
    if(data[r][c]==0){
      //在data中r行c列赋值一个2或4
      data[r][c]=
        Math.random()<0.5?2:4;
      break;//退出循环
    }
  }
}
//将数组内容更新到页面div中
function updateView(){
  for(var r=0;r<RN;r++)//遍历data
    for(var c=0;c<CN;c++){
      //查找和rc位置对应的div
      var div=
        document.getElementById(
          "c"+r+c
        );
      //如果当前元素值不为0
      if(data[r][c]!=0){
        //设置div的内容为当前元素值
        div.innerHTML=data[r][c];
        //在div的class中追加 n?
        div.className=
          "cell n"+data[r][c];
      }else{
        //清除div中的残留内容
        div.innerHTML="";
        //恢复class为cell
        div.className="cell";
      }
    }
  //将score更新到id为score的span中
  var span=
    document.getElementById(
      "score"
    );
  span.innerHTML=score;
  //找到id为gameover的div
  var div=
    document.getElementById(
      "gameover"
    );
  //如果游戏状态为GAMEOVER
  if(status==GAMEOVER){
    //设置div的style的display为block
    div.style.display="block";
    //设置id为final的span的内容为分数
    document.getElementById("final")
      .innerHTML=score;
  }else//否则
    //设置div的style的display为none
    div.style.display="none";
}
//左移所有行
function moveLeft(){
  //为data拍照保存在before中
  var before=String(data);
  //遍历data中每一行
  for(var r=0;r<RN;r++){
    //左移第r行
    moveLeftInRow(r);
  }//(遍历结束)
  //为data拍照保存在after中
  var after=String(data);
  //如果before!=after
  if(before!=after){
    randomNum();//随机生成数
    if(isGAMEOVER())//如果游戏结束
      //就修改游戏状态为GAMEOVER
      status=GAMEOVER;
    updateView();//更新界面
  }
}
//判断游戏结束
function isGAMEOVER(){
  //遍历data中每个元素
  for(var r=0;r<RN;r++){
    for(var c=0;c<CN;c++){
      //如果当前元素是0
      if(data[r][c]==0)
        return false;//返回false
      //否则如果c<CN-1且当前元素等于右侧元素
      else if(c<CN-1
        &&data[r][c]==data[r][c+1])
        return false;//返回false
      //否则如果r<RN-1且当前元素等于下方元素
      else if(r<RN-1
        &&data[r][c]==data[r+1][c])
        return false;//返回false
    }
  }//(遍历结束)
  return true;//返回true
}
//专门移动第r行
function moveLeftInRow(r){
  //c从0开始遍历data中r行每个格，到<CN-1结束
  for(var c=0;c<CN-1;c++){
    //查找c位置右侧下一个不为0的位置nextc
    var nextc=getNextInRow(r,c);
    if(nextc!=-1){//如果找到
      //如果c位置的值为0
      if(data[r][c]==0){
        //将nextc位置的值赋值给c位置
        data[r][c]=data[r][nextc];
        //将nextc位置的值置为0
        data[r][nextc]=0;
        c--;//c留在原地
      }else if(data[r][c]
                ==data[r][nextc]){
      //否则如果c位置的值等于nextc位置的值
        //将c位置的值*2
        data[r][c]*=2;
        //将合并后新值累加到score上
        score+=data[r][c];
        //将nextc位置的值置为0
        data[r][nextc]=0;
      }
    }else //否则(没找到),就退出循环
      break;
  }
}
//专门负责查找r行c列右侧下一个不为0的位置
function getNextInRow(r,c){
  //nextc从c+1开始，到<CN
  for(var nextc=c+1;nextc<CN;nextc++){
    //如果data中r行nextc位置的值不为0
    if(data[r][nextc]!=0)
      return nextc;//就返回nextc
  }//(遍历结束)
  return -1;//返回-1
}
//右移所有行
function moveRight(){
  var before=String(data);//拍照
  //遍历每一行
  for(var r=0;r<RN;r++){
    moveRightInRow(r);//右移第r行
  }
  var after=String(data);//再拍照
  //如果before!=after
  if(before!=after){
    randomNum();//随机生成数
    if(isGAMEOVER())//如果游戏结束
    //就修改游戏状态为GAMEOVER
      status=GAMEOVER;
    updateView();//更新页面
  }
}
//右移第r行
function moveRightInRow(r){
  //c从CN-1开始反向遍历每个列,到>0
  for(var c=CN-1;c>0;c--){
    //查找c位置左侧前一个不为0的位置prevc
    var prevc=getPrevInRow(r,c);
    if(prevc!=-1){//如果找到
      //如果c位置的值为0
      if(data[r][c]==0){
        //将prevc位置的值赋值给c位置
        data[r][c]=data[r][prevc];
        //将prevc位置的值置为0
        data[r][prevc]=0;
        c++;//c留在原地
      }else if(data[r][c]
                ==data[r][prevc]){
      //否则如果c位置的值等于prevc位置的值
        data[r][c]*=2;//将c位置的值*2
        //将合并后新值累加到score上
        score+=data[r][c];
        //将prevc位置的值置为0
        data[r][prevc]=0;
      }
    }else break;//否则,就退出循环
  }
}
//专门查找r行c列左侧前一个不为0的位置
function getPrevInRow(r,c){
  //prevc从c-1开始反向遍历，到>=0结束
  for(var prevc=c-1;prevc>=0;prevc--){
    //如果data中r行prevc位置的值不为0
    if(data[r][prevc]!=0)
      return prevc;//就返回prevc
  }//(遍历结束)
  return -1;//返回-1
}
//上移所有列
function moveUp(){
  var before=String(data);//拍照
  //遍历data中每一列
  for(var c=0;c<CN;c++) {
    moveUpInCol(c);//上移第c列
  }
  var after=String(data);//再拍照
  //如果发生了变化
  if(before!=after) {
    randomNum();//随机生成数
    if(isGAMEOVER())//如果游戏结束
      //就修改游戏状态为GAMEOVER
      status=GAMEOVER;
    updateView();//更新界面
  }
}
//专门上移第c列
function moveUpInCol(c){
  //r从0遍历c列每一行，到<RN-1
  for(var r=0;r<RN-1;r++){
    //查找r行下方下一个不为0的行nextr
    var nextr=getNextInCol(r,c);
    if(nextr!=-1){//如果找到
      //如果r行c列的值为0
      if(data[r][c]==0){
        //就将nextr行c列的值赋值给r行c列
        data[r][c]=data[nextr][c];
        //将nextr行c列的值置为0
        data[nextr][c]=0;
        r--;//r留在原地
      }else if(data[r][c]
                ==data[nextr][c]){
      //否则如果r行c列的值等nextr行c列的值
        //将r行c列的值*2
        data[r][c]*=2;
        //将合并后新值累加到score上
        score+=data[r][c];
        //将nextr行c列的值置为0
        data[nextr][c]=0;
      }
    }else break;//否则,就退出循环
  }
}
//专门查找r行c列下方下一个不为0的行
function getNextInCol(r,c){
  //nextr从r+1开始遍历剩余行，到<RN
  for(var nextr=r+1;nextr<RN;nextr++){
    //如果nextr行c列的值不为0
    if(data[nextr][c]!=0)
      return nextr;//就返回nextr
  }//(遍历结束)
  return -1;//返回-1
}
start();