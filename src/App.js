import React, { useState, useEffect } from 'react';
import './App.css';
import DirectedGraph from './test.js';
import Modal from 'react-modal';


Modal.setAppElement('#root');

function Comp({graph, data, Update}) {
  document.querySelectorAll('.wrapper').forEach((element) => {
    if (!element.classList.contains('show')) {
      element.classList.add('show');
    }
  });
  const id=Object.keys(data);
  const value=data[id];
  const canr=(!value.next.length||value.next.length > 1)&&(!value.prev.length||value.prev.length > 1); //삭제 유무
  let canb=(value.prev.length===1&&value.next.length===1);
  if (canb)
    canb=!(graph.vertices[value.prev[0]].next.length===1&&graph.vertices[value.next[0]].prev.length>1); //분기 유무 확인
  console.log("Comp: ",id,value, canb);

  const handleClick = (graph, id, event) => {
    id = Number(id);
    const clickE = event.target;
    if (clickE.classList.contains('x')) {
    // 비활성화
    } else if (clickE.classList.contains('a')) {  // 추가
      graph.append_next(id);
    } else if (clickE.classList.contains('b')) {  // 분기
      graph.branch(id); // 정점 삽입
    } else if (clickE.classList.contains('r')) {  // 삭제
      graph.remove_vertex(id);
    }
    Update(graph);
  };

  const Style = {
    position: 'absolute',
    left: `${value.data.x}px`,
    top: `${value.data.y}px`,
    // 추가적인 스타일 속성들...
  };

  const [success, setSuccess] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState({
    goal: '',
    achievementRate: 0,
    startDate: '',
    endDate: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setCurrentGoal({
      goal: data[Object.keys(data)].goal || '',
      achievementRate: data[Object.keys(data)].achievementRate || 0,
      startDate: '',
      endDate: '',
    });
  };

  const closeModal = () => {  
    setIsOpen(false);
  };

  const [isOpen1, setIsOpen1] = useState(false);

  const openModal1 = () => {
    setIsOpen1(true);
  };

  const closeModal1 = () => {
    setIsOpen1(false);
  };

  const inputGoal = (e) => {
    setCurrentGoal({
      ...currentGoal,
      goal: e.target.value,
    });
    validateForm();
  };

  const inputAchievementRate = (e) => {
    setCurrentGoal({
      ...currentGoal,
      achievementRate: e.target.value,
    });
    validateForm();
  };

  const inputStartDate = (e) => {
    setCurrentGoal({
      ...currentGoal,
      startDate: e.target.value,
    });
    validateForm();
  };

  const inputEndDate = (e) => {
    setCurrentGoal({
      ...currentGoal,
      endDate: e.target.value,
    });
    validateForm();
  };

  const today = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    if (
      currentGoal.goal.trim() !== '' &&
      currentGoal.achievementRate >= 0 &&
      currentGoal.achievementRate <= 100 &&
      currentGoal.startDate !== '' &&
      currentGoal.endDate !== ''
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const [isInputCompleted, setIsInputCompleted] = useState(false);

  const handleSubmit = () => {
    closeModal();
    value.data = currentGoal.goal;
    value.achievementRate = currentGoal.achievementRate;
    value.startDate = currentGoal.startDate;
    value.endDate = currentGoal.endDate;

    if (currentGoal.achievementRate >= 70) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
    setIsInputCompleted(true); // 입력 완료 상태를 true로 설정합니다.
  };

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const endDate = new Date(currentGoal.endDate);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysRemaining(remainingDays);
    };

    if (currentGoal.endDate !== '') {
      calculateDaysRemaining();
    }
  }, [currentGoal.endDate]);

  const remainingDaysMessage = daysRemaining === 0 ? '마감일이 오늘입니다!' : `남은 일수 : ${daysRemaining}일`;


  // 두 날짜 사이의 기간을 계산하는 함수를 정의합니다.
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end - start;

    // 일 단위로 기간을 계산합니다.
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const durationInDays = Math.floor(durationInMilliseconds / millisecondsPerDay);

    return durationInDays;
  };

  // 컴포넌트 내부에서 calculateDuration 함수를 호출하여 기간을 얻을 수 있습니다.
  const goalDuration = calculateDuration(currentGoal.startDate, currentGoal.endDate);

  const handleReset = () => {
    setCurrentGoal({
      goal: '',
      achievementRate: 0,
      startDate: '',
      endDate: '',
    });
    setIsInputCompleted(false); // 입력 완료 상태를 false로 설정하여 입력 버튼이 나타날 수 있도록 합니다.
    closeModal1();
  };

  let goalText = value.data;
  if (typeof value.data === 'object') {
    goalText = 'Goal'; // 객체 형태인 경우 'Goal'로 설정
  }

  

  return (
    <div className='cont1' style={Style}>
      <div className='add' onClick={(e) => {
        if (!e.target.classList.contains('toolbar')){
          const clickedElements = document.querySelectorAll('.clicked');
          clickedElements.forEach(element => {
            if (element!==e.target)
              element.classList.remove('clicked');
          });
          e.target.classList.toggle('clicked');
        }}}>
         {`${goalText} (${currentGoal.achievementRate}%)`}
         {!isInputCompleted && ( // 입력 버튼을 조건부로 렌더링합니다.
                <button onClick={openModal}>입력</button>
              )}
              <Modal
                  isOpen={isOpen}
                  onRequestClose={closeModal}
                  contentLabel="목표 입력"
                  style={{
                    content: {
                      width: "220px",
                      height: "380px",
                      position: "fixed",
                      top: "50%",
                      left: "15%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 3, // 원하는 z-index 값 설정
                    },
                  }}
                > 
                <form>
                  <div className="form-group"> 
                    <label htmlFor="goalName">목표명</label>
                    <input type="text" id="goalName" value={currentGoal.goal} onChange={inputGoal} placeholder="목표명" />
                  </div> 
                  <div className="form-group">
                    <label htmlFor="achievementRate">목표 달성률(%)</label>
                    {/*label요소가 achievementRate인 입력 필드와*/}
                    <input
                      type="number"/*숫자*/
                      id="achievementRate"/*입력 필드의 값*/
                      value={currentGoal.achievementRate}/**/
                      onChange={inputAchievementRate}/*호출할 때 실행되는 함수*/
                      placeholder="목표 달성률(%)"/*목표 달성률*/
                      min="0" /*최솟값 0*/
                      max="100" /*최댓값 100*/
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="startDate">시작일</label>
                    <input
                      type="date"
                      id="startDate"
                      value={currentGoal.startDate}
                      onChange={inputStartDate}
                      min={today} 
                      placeholder="시작일" 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">마감일</label>
                    <input
                      type="date"
                      id="endDate"
                      value={currentGoal.endDate}
                      onChange={inputEndDate}
                      min={currentGoal.startDate || today}
                      placeholder="마감일"
                    />
                  </div>
                  <button className="submit-button" disabled={!isFormValid} onClick={handleSubmit}>
                    Submit
                  </button>
                </form>
              </Modal>
        <button onClick={openModal1}>확인</button> {/* Added "Goal Check" button */}
        <Modal
          isOpen={isOpen1}
          onRequestClose={closeModal1}
          style={{
            content: {
              width: "220px",
              height: "430px",
              position: "fixed",
              top: "50%",
                left: "15%",
              transform: "translate(-50%, -50%)",
              zIndex: 3, // z-index 값을 2보다 높은 값으로 설정
            },
          }}
        > <div class="goal-container">
        {currentGoal.goal && (
          <div>
            <p>목표명: {currentGoal.goal}</p>
            <hr/>
            <p>달성률(%): {currentGoal.achievementRate === 0 ? '' : currentGoal.achievementRate}</p>
            <hr/>
            <p>시작일: {currentGoal.startDate}</p>
            <hr/>
            <p>마감일: {currentGoal.endDate}</p>
            <hr/>
            {success && <p style={{ color: "green" ,fontSize: "24px" }}>성공<hr></hr></p>}
            
            {currentGoal.endDate && (
              <div>
                <p>{remainingDaysMessage}</p>
              </div>
            )}
            <hr></hr>
            <p>기간: {goalDuration >= 0 ? goalDuration : ''}</p>
            <hr />
            <button onClick={handleReset}>재설정</button>
          </div>
        )}
      </div>
        </Modal>
        <div className="toolbar">
          <div className={canr ? "exp r x":"exp r"} onClick={(event) => handleClick(graph, id, event)}>
              삭제
          </div> <hr className='hr'/>
          <div className={canb ? "exp b" : "exp b x"} onClick={(event) => handleClick(graph, id, event)}>
              ↓
          </div> <hr className='hr'/>
          <div className="exp e" onClick={(event) => handleClick(graph, id, event)}> 수정
          </div> 
          <hr className='hr'/>
          <div className="exp a" onClick={(event) => handleClick(graph, id, event)}>
              +
          </div>
        </div>
      </div>
    </div>
  );
}

function Plan({graph, delplan}) {
  console.log(graph)
  const [components, setComponents] = useState(Object.entries(graph.vertices).map(([key, value]) => ({ [key]: value }))); //그래프 관리 useState, {id:정점 객체}
  const Update = (graph) => {
    setComponents(Object.entries(graph.vertices).map(([key, value]) => ({ [key]: value })));
  };
  useEffect(() => {
    Update(graph);
  }, [graph]);
  console.log('---------------------------------------\n그래프(Plan): ', graph);
  const Style = {
    height: `${graph.height}px`,
    width: `${graph.width}px`
    // 추가적인 스타일 속성들...
  };
  if (!graph)
    return <div></div>;
  return (
    <div className='wrapper' style={Style}>
      <p className='pn'>계획 {graph.id}</p>
      <div className='planset'>
        <div className='print' onClick={(e) => graph.print_graph()}>출력(DevTools)</div>
        <div className='print' onClick={(e) => {console.log("불러오기")}}>불러오기</div>
        <div className='print' onClick={(e) => {console.log(JSON.stringify(graph))}}>저장</div>
        <div className='print' onClick={(e) => {delplan(graph)}}>삭제</div>
      </div>
      <div className='cont'>
      {
      components.map((value, index) => { //value 데이터는 {id:Vertex} 형태
        const data=Object.values(value)[0];
        console.log('순회: ',data.prev, data)
        return (
        <div className='node'>
          {
            data.next.map(next => {
              const dataX = data.data.x+100;
              const dataY = data.data.y-10;
              const ldata = graph.vertices[next]
              const ldataX = ldata.data.x+30;
              const ldataY = ldata.data.y-10;
              const test = 0.6; //퍼센트
              const perc = test-0.1*test/1//가중치
              const totalLength = Math.sqrt(Math.pow(ldataX - dataX, 2) + Math.pow(ldataY - dataY, 2));
              const ratio = totalLength * perc / totalLength;

              const newX = dataX + (ldataX - dataX) * ratio;
              const newY = dataY + (ldataY - dataY) * ratio;
              
              return (
                <svg key={next} width="100%" height="100%" style={{ position: 'absolute' }}>
                  <line x1={dataX} y1={dataY} x2={ldataX} y2={ldataY} stroke="rgba(61, 61, 61, 0.3)" strokeWidth="5" />
                  {/* <path d={`M ${dataX} ${dataY} Q ${(dataX+ldataX)/2-25} ${(dataY+ldataY)/2+5} ${ldataX} ${ldataY}`}//베지어 곡선 그리기
                    stroke="rgba(61, 61, 61, 0.3)" strokeWidth="5" fill="none"
                  /> */}
                  <line x1={dataX} y1={dataY} x2={newX} y2={newY} stroke="rgba(61, 61, 61, 0.3)" strokeWidth="5" />
                </svg>
              );
            })
          }
          <Comp
            key={value.id} // 고유한 키 값으로 설정
            graph={graph} 
            data={value}
            Update={Update}
          />
        </div>
      )})}
      </div>
    </div>
  );
}

function App(){
  const [plans, setPlan] = useState([]); //계획 관리 useState, {id:그래프(계획) 객체}
  const Delete = (graph) => {
    setPlan((prevPlans) => {
      const list = [...prevPlans];
      return list.filter(item => item !== graph);
    });
  };
  return (
    <div className='body'>
      <div className='nav'>
        로그인
      </div>
      <div className='canv'>
        <h1>FPS</h1>
        <div className='changethis'>
        {plans.map((plan) => (
          <Plan
            key={999+plan.id} // 고유한 키 값으로 설정
            graph={plan}
            delplan={Delete}
          />
        ))}
        </div>
        <div className='Plan a' onClick={(e) => {
          const newId = plans.length ? Math.max(...plans.map(item => item.id))+1 : 0; //새 plan id
          setPlan([...plans, new DirectedGraph(newId)])
          }}>+
        </div>
      </div>
      
    </div>
  );
}

export default App;