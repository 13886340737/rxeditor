import {add, remove, first, last, insertBefore, insertAfter, contains, after, before} from "../../../basic/rxarray"

class TreeNode{
  constructor(tree, schema){
    this.tree = tree
    this.schema = schema ? schema : {id:'', label:''}
    this.label = this.schema.label
    this.id = this.schema.id
    this.selected = false
    this.opened = false
    this.children = []
    if(schema){
      this.loadChildren(schema.children)
    }
  }

  add(node){
    node.parent = this
    add(node, this.children)
    return this
  }

  removeChild(node){
    remove(node, this.children)
  }

  loadChildren(schemas){
    if(!schemas) return

    schemas.forEach((schema)=>{
      this.add(new TreeNode(this.tree, schema))
    })
  }

  excuteCommand(commandSchema){
    if(commandSchema.command === 'new'
      && this.schema.id == commandSchema.parentId){
      let newNode = new TreeNode(this.tree, commandSchema.node)
      this.insertBefore(newNode, commandSchema.nextSblilingId)
      return true
    }
    if(/*this.schema.id &&*/ commandSchema.nodeId === this.schema.id){
      if(commandSchema.command === 'delete'){
        this.parent.removeChild(this)
      }
      if(commandSchema.command === 'move'){
        let oldParent = this.tree.getNodeById(commandSchema.oldParentId)
        oldParent = oldParent ? oldParent : this.tree.bodyNode
        oldParent.removeChild(this)
        let parent = this.tree.getNodeById(commandSchema.parentId)
        parent = parent ? parent : this.tree
        parent.insertBefore(this, commandSchema.nextSblilingId)
      }
      if(commandSchema.command === 'change'){
        this.schema.tag = commandSchema.meta.tag
      }     
      return true
    }
    for(var i in this.children){
      if(this.children[i].excuteCommand(commandSchema)){
        return true
      }
    }
  }

  insertBefore(node, sbilingId){
    node.parent = this
    let sbilingNode = this.tree.getNodeById(sbilingId)
    insertBefore(node, sbilingNode, this.children)
  }

  getNodeById(id){
    if(this.schema.id === id){
      return this
    }
    for(var i in this.children){
      let node = this.children[i].getNodeById(id)
      if(node){
        return node
      }
    }
  }
}

export class NodeTree extends TreeNode{
  constructor(){
    super()
    this.tree = this
  }
}