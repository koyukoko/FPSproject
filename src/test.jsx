class Vertex {
  constructor(id, data) {
  this.id = id;
  this.data = data;
  this.prev = []; // 이전 노드 리스트
  this.next = []; // 다음 노드 리스트
  }
}

// 분기, 삭제 가능 유무 데이터 추가해야함

export default class DirectedGraph {
  constructor(id) {
    this.id=id;
    this.vertices = {}; // 정점들을 저장하는 객체, { id: Vertex객체 }
    this.height=300;
    this.width=900;
    this.first=this.add_vertex(0, {text:'first', x:20, y:this.height/2}).id; //첫번째 노드 ID
  }

  add_vertex(id, data) {  //정점 추가
    const new_vertex = new Vertex(id, data);
    if (!(id in this.vertices)) {
      this.vertices[id] = new_vertex;
    }
    return new_vertex;  //반환도 해중
  }

  add_edge(from_vertex_id, to_vertex_id) {  //간선 추가
    if (from_vertex_id in this.vertices && to_vertex_id in this.vertices) {
      const from_vertex = this.vertices[from_vertex_id];
      const to_vertex = this.vertices[to_vertex_id];
      to_vertex.prev.push(from_vertex_id);
      from_vertex.next.push(to_vertex_id);  //순환참조 막기 위해 아이디로 저장
      console.log(to_vertex,"------------>>>>>",from_vertex)
    }
  }

  append_next(vertex_id) {
    const next = this.next_vertexs(vertex_id); // vertex_id 정점 다음의 모든 정점 ID 배열
    const newId = Math.max(...Object.keys(this.vertices)) + 1;  //새 ID 생성
    const vertex=this.vertices[vertex_id];
    if (vertex.next.length&&vertex.data.x+150 >= this.vertices[vertex.next[0]].data.x){
      Object.entries(this.vertices).forEach(([key, value]) => {
        if (value.data.x > vertex.data.x) {
          value.data.x += 150;
        }});
    }
    this.add_vertex(newId, {text:'Append ' + newId, x:vertex.data.x+150, y:vertex.data.y});
    this.add_edge(vertex_id, newId); // 현재-새 정점
    for (const i of next) {
      if (i!==newId){
        this.add_edge(newId, i); // 새 정점-next
        this.delete_edge(vertex_id, i); // vertex_id-next 간선 제거
      }
    }
  }

  branch(vertex_id) {
    const prev = this.prev_vertexs(vertex_id); // 연결된 ID가 vertex_id인 모든 정점 ID 배열
    const next = this.next_vertexs(vertex_id); // vertex_id 정점 다음의 모든 정점 ID 배열
    const vertex=this.vertices[vertex_id];
    let count=[];
    if (prev.length === 1 && next.length === 1) { //0-0-0의 경우만 분기 가능
      const newId = Math.max(...Object.keys(this.vertices)) + 1;
      const nextid=(prev.length===1&&this.vertices[prev[0]].next.length===1&&this.vertices[next[0]].prev.length===1) ? next[0] : this.next_branch(prev[0]);
      this.add_vertex(newId, {text:'Append ' + newId, x:vertex.data.x, y:vertex.data.y});
      this.add_edge(prev[0], newId); // 전 정점-새 정점
      //앞뒤 위상의 간선 개수 1개며 이전 정점이 1개일때
      this.add_edge(newId, nextid); // 새 정점-분기 끝나는 정점

      Object.entries(this.vertices).forEach(([key, value]) => {
        const prevO=this.vertices[value.prev[0]]; //이전 객체
        if (value.data.x === vertex.data.x&&prevO.id===prev[0]) {
          count.push(value);  //가로 같고 이전인 노드
        }});
      const prevy=this.vertices[prev[0]].data.y;
      let min=0, max=0;
      count.map((value, index) => {
        const c=(index===(count.length-1) / 2) ? 0 : (index < count.length / 2 ? -(index+1) : index-Math.floor(count.length/2));//대칭행렬
        console.log(c, (count.length%2) ? prevy-90*c : prevy-35-90*c)
        value.data.y = (count.length%2) ? prevy-90*c : prevy-35-90*c;
        min=min>value.data.y ? value.data.y : min;
        max=max<value.data.y ? value.data.y : max;
        return value;
      });
      if (max-min>this.height){
        console.log(this.height, max-min)
        Object.entries(this.vertices).forEach(([key, value]) => {
          if (count.includes(value)){
            count.map((value, index) => {
              const c=(index===(count.length-1) / 2) ? 0 : (index < count.length / 2 ? -(index+1) : index-Math.floor(count.length/2));//대칭행렬
              const prevy=this.vertices[prev[0]].data.y;
              value.data.y = (count.length%2) ? prevy-90*c : prevy-35-90*c;
              return value;
            });
          }
          else
            value.data.y += (max-min-this.height)/2;
        });
        this.height=max-min;
      }
    } else {
      console.log('분기 안되죠');
    }
  }

  delete_vertex(vertex_id) {  //정점 삭제
    if (vertex_id in this.vertices) {
      const vertex = this.vertices[vertex_id];
      for (const prev_vertex of vertex.prev) {
        const prevO=this.vertices[prev_vertex]; //id->객체
        prevO.next = prevO.next.filter(next_vertex => next_vertex !== vertex.id);
      }
      for (const next_vertex of vertex.next) {
        const nextO=this.vertices[next_vertex]; //id->객체
        nextO.prev = nextO.prev.filter(prev_vertex => prev_vertex !== vertex.id);
      }
      delete this.vertices[vertex_id];
    }
  }

  delete_edge(from_vertex_id, to_vertex_id) { //간선 삭제
    if (from_vertex_id in this.vertices && to_vertex_id in this.vertices) {
      const from_vertex = this.vertices[from_vertex_id];
      const to_vertex = this.vertices[to_vertex_id];
      from_vertex.next = from_vertex.next.filter(next_vertex => next_vertex !== to_vertex.id);
      to_vertex.prev = to_vertex.prev.filter(prev_vertex => prev_vertex !== from_vertex.id);
    }
  }

  prev_vertexs(vertex_id) { //연결된 ID가 vertex_id인 모든 정점 ID 배열 반환
    const vertex = this.vertices[vertex_id];
    if (vertex) {
      return vertex.prev;
    }
  }

  next_vertexs(vertex_id) { //vertex_id 정점 다음의 모든 정점 ID 배열 반환
    if (Array.isArray(vertex_id)) { //id가 배열로 넘어오면 첫 데이터로
      return this.next_vertexs(vertex_id[0]);
    }
    const vertex = this.vertices[vertex_id];
    if (vertex) {
      return vertex.next;
    }
  }

  execute(prev, next, vertex_id) {  //정점 제거 실행, 경우가 많아서 함수로 뺌
    let vertexX=this.vertices[vertex_id]
    if (vertexX)
      vertexX=vertexX.data.x;
    const count=[];
    for (const i of prev) {
      this.delete_edge(i, vertex_id);
    }
    for (const i of next) {
      this.delete_edge(vertex_id, i); // vertex_id와 관련된 모든 간선 제거
    }
    this.delete_vertex(vertex_id); // vertex_id 제거
    Object.entries(this.vertices).forEach(([key, value]) => {
      if (value.data.x)
      if (value.data.x === vertexX) {
        count.push(value);  //같은 x 좌표의 노드(분기 유무) 확인
      }});
    Object.entries(this.vertices).forEach(([key, value]) => {
      if (count.length!==1&&count.includes(value)) {  //있으면 해당 x좌표 노드 재배열
        const index=count.indexOf(value);
        const c=(index===(count.length-1) / 2) ? 0 : (index < count.length / 2 ? -(index+1) : index-Math.floor(count.length/2));//대칭행렬
        const prevy=this.vertices[prev[0]].data.y;
        value.data.y = (count.length%2) ? prevy-90*c : prevy-35-90*c;
      }else if (count.length===0&&value.data.x > vertexX) { //없으면 x좌표 다음것들 다 땡겨
        value.data.x -= 150;
      }else if (count.length) //삭제하고 그 열에 하나남았을때
        count[0].data.y=this.height/2;
    });
  }

  remove_vertex(vertex_id) {
    const prev = this.prev_vertexs(vertex_id); // 연결된 ID가 vertex_id인 모든 정점 ID 배열
    const next = this.next_vertexs(vertex_id); // vertex_id 정점 다음의 모든 정점 ID 배열
    if (!prev.length || prev.length > 1) {  //이전 노드가 없거나 2개 이상일때
      if (!next.length || next.length > 1) {  //다음 노드도 그러면 삭제 불가
        console.log('삭제 불가');
        return;
      }
      for (const i of prev) { //이전노드 순회, next가 1개인 경우
        console.log('찾았따', i, next[0]);
        this.add_edge(i, next[0]); // 삭제될 정점 앞뒤 잇기
        this.execute(prev, next, vertex_id);
      }
      return;
    }
    let vlist = this.next_vertexs(prev);
    vlist = vlist.filter(v => v !== vertex_id);
    if (vlist.length) { //이전 노드의 모든 next 리스트
      for (const i of vlist) {
        let nextl = this.next_vertexs(i);
        while (nextl) {
          for (const j of next) {
            if (nextl[0] === j) {
              console.log('찾았따', prev[0], i);
              this.execute(prev, next, vertex_id);
              break;
            }
          }
          nextl = this.next_vertexs(nextl);
        }
      }
    } else {
      for (const i of next) {
        this.add_edge(prev[0], i); // 삭제될 정점 앞뒤 잇기
      }
      this.execute(prev, next, vertex_id); // 정점 삭제
      return;
    }
  }

  print_graph() {
    for (const vertex of Object.values(this.vertices)) {
      console.log(`Vertex ID: ${vertex.id}, Data: ${vertex.data}, Prev: ${vertex.prev}, Next: ${vertex.next}`);
    }
    const result = ((first) => {
      let branchList=first+', ';
      let branch=this.next_branch(first);
      while (true){
        branchList+=branch+', ';
        if (this.next_branch(branch)===branch)
          break;
        else
          branch=this.next_branch(branch);
      }
      return branchList.slice(0, branchList.length - 2);
    })(this.first);
    console.log("TEST: ",this.print_route(this.first), '\n분기점: ', result);
    console.log();
  }

  print_route(vertex_id){  //컴포넌트 재귀호출로 프린팅
    const vertex=this.vertices[vertex_id];  //해당 객체
    let text='';  //이악물고 재귀인 이유: 트리 성격이라
    if (vertex.next.length){
      if (vertex.next.length>1){  //묶기 시작
        text+='->(';
        for (const i of vertex.next){
          text+=this.print_route(i)+',';
        }
        text=text.slice(0,-1)+")";  //묶기 끝
      }
      for (const i of vertex.next){ //묶을 때 실행
        if (vertex.next.length===this.vertices[i].prev.length) 
          text+='->'+this.print_route(this.vertices[i].id);
      }
      if (vertex.next.length>1){ //현재 정점 next 리스트 여러개면
        text+='->'+this.print_route(this.next_branch(vertex_id)); //가장 최근 정점의 다음으로
      }
      return vertex_id+text;
    } //next 없으면 리턴
    else{
      return text+vertex_id;
    }
  }

  next_branch(vertex_id){  //분기시 분기 다음정점 리턴, 분기 없는경우 맨 마지막 정점 리턴
    const vertex=this.vertices[vertex_id];  //해당 객체
    const stop=vertex.next.length;
    if (stop){
      let tmp=this.vertices[vertex.next[0]];
      while(tmp.prev.length!==stop){
        tmp=this.vertices[tmp.next[0]];
      }
      return (tmp.next) ? tmp.id : vertex_id;
    }
    return vertex_id;
  }
}