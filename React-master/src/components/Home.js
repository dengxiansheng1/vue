import React ,{Component} from 'react'
import '../assets/css/index.css'
import Local from '../common/local'
class Home extends Component {
  constructor(){
    super()
    this.state ={
      isEdit: -1,
      act:0,
      beforeTxt:'',
      list: Local.get("list")
    }
  }

  get num () {
    let oList = this.state.list
    return oList.filter(x=>!x.isCompleted).length
  }
  get filterList(){
    if(this.state.act == 0){
      return this.state.list;
    }else if(this.state.act == 1){
      return this.state.list.filter(x => !x.isCompleted)
    }else if(this.state.act == 2){
      return this.state.list.filter(x => x.isCompleted)
    }
  }
  changeAct = (num) =>{
    this.setState({
      act:num
    })
    Local.save("list",this.state.list);
  }
  addList = (e) => {
    if(e.keyCode === 13){
      if(e.target.value!=""){
        let item =  {
          isCompleted:false,
          txt:e.target.value
        }
        let nList = this.state.list
        nList.push(item)
        this.setState({
          list:nList
        })
        e.target.value = ""
      }else{
        alert('不能为空')
      }
    }
    Local.save("list",this.state.list);
  }
  changeState = (index) => {
    let nList = this.state.list
    nList[index].isCompleted = !nList[index].isCompleted
    this.setState({
      list: nList
    });
    Local.save("list",this.state.list);
  }
  editing = (index) =>{
    let oTxt  = this.state.list[index].txt
    this.setState({
      isEdit: index,
      beforeTxt:oTxt
    });
    Local.save("list",this.state.list);
  }
  changeEdit = (index,e)=>{
    if(e.keyCode === 13){
      this.setState({
        isEdit: -1
      });
    }else{
      if(e.keyCode===27){
        let nList = this.state.list
        nList[index].txt = this.state.beforeTxt
        this.setState({
          list: nList,
          isEdit:-1
        });
      }
    }
    Local.save("list",this.state.list);
  }
  changeEd = (index,e)=>{
    let nList = this.state.list
    nList[index].txt = e.target.value
    this.setState({
      list: nList,
    });
    Local.save("list",this.state.list);
  }
  save = () => {
    this.setState({
      isEdit: -1,
    });
    Local.save("list",this.state.list);
  }
  del = (index) =>{
    let oList = this.state.list
    let nList = oList.splice(index,1)
    this.setState({
      list: oList,
    });
    Local.save("list",this.state.list);
  }
  render(){
    return (
      <div>
      <div className="page-top">
        <div className="page-content">
          <h2>任务计划列表</h2>
        </div>
      </div>
      <div className="main">
        <h3 className="big-title">添加任务：</h3>
        <input placeholder="例如：吃饭睡觉打豆豆；    提示：+回车即可添加任务" className="task-input" type="text" onKeyUp={this.addList} />
        <ul className="task-count">
          <li>{this.num}个任务未完成</li>
          <li className="action">
            <a className={this.state.act === 0?'active':''} onClick={this.changeAct.bind(this,0)}>所有任务</a>
            <a className={this.state.act === 1?'active':''} onClick={this.changeAct.bind(this,1)} >未完成的任务</a>
            <a className={this.state.act === 2?'active':''} onClick={this.changeAct.bind(this,2)} >完成的任务</a>
          </li>
        </ul>
        <h3 className="big-title">任务列表：</h3>
        <div className="tasks">
          <span className="no-task-tip">还没有添加任何任务</span>
          <ul className="todo-list">
            {
              this.filterList.map((val,index)=>{
                return (
                  <li
                    className={`todo ${val.isCompleted ? 'completed' : ''} ${index === this.state.isEdit ? 'editing':''}`}
                    key={index}
                    onDoubleClick={this.editing.bind(this,index)}
                    onKeyUp={this.changeEdit.bind(this,index)}>
                    <div className="view">
                      <input className="toggle"
                        type="checkbox"
                        checked={ val.isCompleted }
                        onChange={ this.changeState.bind(this,index)}/>
                      <label>{val.txt}</label>
                      <button className="destroy" onClick={this.del.bind(this,index)}></button>
                    </div>
                    <input className="edit" type="text"
                    value={ val.txt }
                    onBlur={this.save}
                    onChange={ this.changeEd.bind(this,index)}/>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      </div>
    )
  }
}
export default Home;
