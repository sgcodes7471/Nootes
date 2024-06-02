import {useState ,  useEffect} from 'react';
import {  useNavigate} from 'react-router-dom'
import axios from 'axios'
import './LandingPage.css';
import './LoginPage.css';
import './SignupPage.css';
import './MainPage.css';


function MainPage(){

  const currentNotes=[]
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [notes ,  setNotes]=useState(currentNotes);
  const [id , setId]=useState(0);
  const [saveStatus , setSaveStatus]=useState(true);
  const [loggedInUser , setLoggedInUser] = useState(localStorage.getItem('loggedInUser'));
  const [AccessToken  , setAccessToken ]= useState(localStorage.getItem('AccessToken'));
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('AccessToken');

//for /LogIn/:id
  const getNotes= async ()=>{
   try{
    if(!loggedInUser && !AccessToken){
      return;    }

    const response = await fetch(`/LogIn/${loggedInUser._id}` , {
      method:'GET',
      headers:{
        'authorization' : `Bearer ${AccessToken}`
      }
    })
    if(response.status === 200){
      let {notesList, user}= await response.json()
      //a problem might occur here as I am storing a json data in a array state variable
      setNotes(notesList)
      setName(user.fullname)
      }
   }catch(error){
    alert("Unexpected Error Occurred")
   }
  }
  useEffect(()=>{
    getNotes()
  })


//for /LogIn/:id/add-Note
  const addNotes = async (newNote)=>{
   
    try{
      if(newNote.heading === "" && newNote.content === ""){
        alert("Write Something to Save");
        return;
      }
      
      const response = await axios.post(`/LogIn/${loggedInUser._id}/add-Note` , {
        headers:{
          'authorization'  : `Bearer ${AccessToken}`
        }
      }, {heading : newNote.heading, id:newNote.id , content: newNote.content})
        const data = await response.json()
        setSaveStatus(true)
        getNotes()
        alert(data.message)
    }catch(error){
      alert("Error in Adding New Note from our side. Please Try Later!! Sorry for Inconviniece");
    }
  }
  

//for /LogOut/:id
const logOut =async ()=>{
  try{
    const response = await axios.post('/LogOut/:id' , {
      headers:{
        'authorization'  : `Bearer ${AccessToken}`
      } 
    } , {AccessToken : AccessToken})
    const data= await response.json();
      alert(data.message);
    if(response.status === 200){
      navigate('/' , {replace:true})
    }
  }catch(error){
    console.log(error);
    alert("Could not Logout due to Server Issues, Please Try Later!! Sorry for Inconviniece")
  }
}


//for /LogIn/:id/del-Note/:noteId
const delNotes = async (note)=>{
 try{
  const response = await axios.delete(`/LogIn/${loggedInUser._id}/del-Note/${note._id}` , {
    headers:{
      'authorization'  : `Bearer ${AccessToken}`
    }
  })
  const data=response.json();
  if(response.status === 200){
    getNotes();
  }
  alert(data.message);
 }catch(error){
  console.log(error);
  alert("Could not delete Note due to Server Issues, Please Try Later!! Sorry for Inconviniece")
 }
}


//for /LogIn/:id/edit-Note/:noteId
const editNotes = async (note)=>{
  try{
    const response = await axios.put(`/LogIn/${loggedInUser._id}/edit-Note/${note._id}` , {
      headers:{
        'authorization' : `Bearer ${AccessToken}`
      }
    }, {heading:note.heading , content:note.content})
    const data= response.json();
    if(response.status === 200){
      getNotes();
    }
    alert(data.message)
  }catch(error){
    console.log(error);
    alert("Could not Edit Note due to Server Issues, Please Try Later!! Sorry for Inconviniece")
  }
}





//this function only creates a new empty note still keep it
  function handleNoteAdd(){
    
    setNotes([
      ...notes , 
      {
        id:id,
        heading:"",
        content:"",
      }]
    )
    let n=id+1;
    setId(n);
    setSaveStatus(false)
}

//this function deletes from frontend but remove it later on and call delNotes(t) directly from the DEL button
  function handleNoteDel(t){
    delNotes(t);
    setNotes(
      notes.filter(a=>a.id!==t.id)
    )
  }

  //these functions update the notes in the frontend only still keep it
  function handleNoteEditContent(e , t){
    notes.map((a)=>{
      if(a.id === t.id)
        a.content=e.target.value;
    })
    setNotes(notes);
  }
  function handleNoteEditHeading(e , t){
    notes.map((a)=>{
      if(a.id === t.id)
        a.heading=e.target.value;
    })
    setNotes(notes);
  }






  return(<>

    <div className='main-logout-btn-wrapper'> 
    <button className='main-logout-btn' onClick={logOut}>Log Out</button>
    </div>

  <div className='body-wrapper'>

    <div className='main-heading-wrapper'>
      <div className='main-heading'>
      Welcome to NOOTES, {name}</div>
      <div className='main-sub-heading'>Note What Matters the most, at the place for the best!</div>
      </div>

      <div className='main-notes-wrapper'>
        {notes.map((t)=>{
            return(<>
            <div className='notes-section'>
              <div className='notes-heading'><textarea className='heading-textarea' placeholder='Add Title here' onChange={(e)=>{handleNoteEditHeading(e , t)}}>{t.heading}</textarea></div>
              <div className='notes-content'><textarea placeholder='Add Notes here' onChange={(e)=>{handleNoteEditContent(e , t)}}>{t.content}</textarea></div>
              <div className='notes-footer'>
              <div className='notes-del'><button onClick={(e)=>{handleNoteDel(t)}}>DEL</button></div>
              <div className='notes-del'><button onClick={editNotes}>SAVE EDIT</button></div>
              </div>
              
            </div>
            </>)
        })}
      <div className='notes-section notes-new-notes '>
        {saveStatus? (<button className='add-new-notes-btn' onClick={(e)=>{handleNoteAdd()}}>+</button> ) : 
        ( <button className='save-new-notes-btn' onClick={()=>{addNotes(notes[id-1])}}>SAVE</button> )}
        
        </div>
      </div>
  </div>
  </>)
}





export default MainPage  