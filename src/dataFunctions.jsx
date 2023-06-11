import { db } from './firebase';
import {collection, addDoc, doc, getDocs, deleteDoc} from './firebase';
import {useRef} from 'react';

//계획 생성 함수
export const createPlan = async (planId) => {
  try{
    const title = document.querySelector('input[name="planTitle"]').value;
    
    
    const planData = {
      planId: planId,
      title: title,
    };

    const docRef = await addDoc(collection(db, 'plans'), planData);
    console.log('계획이 생성되었습니다.', docRef.id);
  } catch(error){
    console.error('계획 생성에 실패하였습니다.', error);
  }
};

//계획, 노드 매핑 함수
export const mapNodeToPlan = async (planId) => {

}


//노드 수정 함수
export const updateNode = async (collectionName, documentId, newData) => {
    try{
        await collection(collectionName).doc(documentId).update(newData);
        console.log('데이터 수정에 성공하였습니다.');
    }catch(error){
        console.error('데이터 수정을 실패하였습니다.', error);
    }
};

//계획 노드 생성 함수
export const createNode = async () => {
  try {
    const goaltitle = document.querySelector('input[name="goaltitle"]').value;
    const goalAchieverate = document.querySelector('input[name="goalAchieverate"]').value;
    const startday = document.querySelector('input[name="startday"]').value;
    const endday = document.querySelector('input[name="endday"]').value;

    const nodeData = {
      title: goaltitle,
      rate: goalAchieverate,
      start: startday,      
      end: endday,
    };

    const docRef = await addDoc(collection(db, '노드'), nodeData);
    const nodeId = docRef.id;
    console.log('노드가 생성되었습니다.', nodeId);
  } catch (error) {
    console.error('노드 생성에 실패하였습니다.', error);
  }
};

//노드 삭제 함수
export const deleteNode = async (nodeId) => {
    try {
      // Firestore 컬렉션에서 노드 삭제
      await deleteDoc(doc(collection(db, '노드'), nodeId));
      console.log('노드가 삭제되었습니다.', nodeId);
    } catch (error) {
      console.error('노드 삭제에 실패하였습니다.', error);
    }
  };


//모든 노드 정보 출력(콘솔)
export const printAllNodesConsole = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, '노드'));
    const sortedNodes = querySnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => a.title.localeCompare(b.title));

    sortedNodes.forEach((nodeData) => {
      console.log('노드 정보:', nodeData);
    });
  } catch (error) {
    console.error('노드 정보 가져오기에 실패하였습니다.', error);
  }
};


//모든 노드 정보 출력(front)
export const printAllNodes = async (setNodes) => {
  try {
    const querySnapshot = await getDocs(collection(db,'노드'));
    const sortedNodes = querySnapshot.docs
      .map((doc) => {
        return {...doc.data(), id: doc.id}
      })
      .sort((a, b) => a.title.localeCompare(b.title));

    // sortedNodes.forEach((nodeData) => {
    //   console.log('노드 정보:', nodeData);
    // });

    console.log('full node :', sortedNodes)

    setNodes(sortedNodes);
  } catch (error) {
    console.error('노드 정보 가져오기에 실패하였습니다.', error);
   }
};

//모든 노드 삭제(front), 컴포넌트만 삭제한 것임.
export const clearAllNodes = (setNodes) => {
  setNodes([]);
}

// userCollection 생성
export const createUserCollection = async (uid) => {
  const userCollectionRef = db.collection(uid);
  const newUser = {
    UID : uid,
  };
  const docRef = await userCollectionRef.add(newUser);
  console.log("User document added with ID: ", docRef.id);
};

// planCollection 생성
export const createPlanCollection = async () => {
  const planCollectionRef = db.collection("planCollection");
  const newPlan = {
    // 여기에 필요한 plan 데이터를 추가하십시오.
  };
  const docRef = await planCollectionRef.add(newPlan);
  console.log("Plan document added with ID: ", docRef.id);
};

// nodeCollection 생성
export const createNodeCollection = async () => {
  const nodeCollectionRef = db.collection("nodeCollection");
  const newNode = {
    // 여기에 필요한 node 데이터를 추가하십시오.
  };
  const docRef = await nodeCollectionRef.add(newNode);
  console.log("Node document added with ID: ", docRef.id);
};


