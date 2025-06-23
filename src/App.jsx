import { useCallback, useState, useEffect,useRef} from 'react'


function App() {
  const [length, setlength] = useState(8)
  const[numberAllowed,setNumberAllowed]=useState(false)
  const[characterAllowed,setCharacterAllowed]=useState(false)
  const[password,setPassword]=useState("")

  //useRef hook
  const passwordRef=useRef(null)

  const passwordGenerator = useCallback(()=>{
    let password=""
    let str="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if(numberAllowed) str +="0123456789"
    if(characterAllowed) str +="!@#$%^&*"

    for (let i = 1; i <=length; i++){
      let char = Math.floor(Math.random()* str.length +1)
      password += str.charAt(char)
  }
  setPassword(password)
},[length,numberAllowed,characterAllowed,setPassword])

const copyPasswordToclipboard=useCallback(()=>{
  passwordRef.current?.select();
  passwordRef.current?.setSelectionRang(0,6);
  window.navigator.clipboard.writeText(password)
},[password])
  
useEffect(()=>{
  passwordGenerator()
},[length,numberAllowed,characterAllowed,passwordGenerator])
  return (
    <>
     <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 my-8 text-white-500 bg-black'>
      <h1 className='text-white text-center my-3'>Password Generator</h1>


      <div className='flex shadow rounded-lg overflow-hidden mb-4'>
        <input type="text"
        value={password}
        className='outling-none w-full py-1 px-3'
        placeholder='password'
        readOnly 
        ref={passwordRef}/>

        <button 
        onClick={copyPasswordToclipboard}className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 hover:bg-sky-700'>Copy</button>
      </div>



      <div className='flex text-sm gap-x-2'>


        <div className='flex items-center gap-x-1 text-white text-4'>
          <input type="range"
          min={5}
          max={15}
          value={length}
          className='cursor-pointer'
          onChange={(e) =>{setlength(e.target.value)}} />
          <label>Length:{length}</label>
        </div>



        <div className='flex items-center gap-x-1 text-white'>
          <input type="checkbox"
          defaultChecked={numberAllowed}
          id='numberInput'
          onChange={()=>{
            setNumberAllowed((prev)=>!prev)
          }} className='cursor-pointer text-white'/>
          <label htmlFor="numberInput">Numbers</label>
        </div>


        <div className='flex items-center gap-x-1 text-white'>
          <input type="checkbox"
          defaultChecked={characterAllowed}
          id='characterInput'
          onChange={()=>{
            setCharacterAllowed((prev)=>!prev)
          }} className='cursor-pointer text-white'/>
          <label htmlFor="charactersInput">Characters</label>
        </div>

      </div>
     </div>
    </>
  )
}

export default App
