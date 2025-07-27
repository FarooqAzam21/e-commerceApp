import React, { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import  './chatbot.css'
import { getChatModel } from './gemini'
export default function Chatbot() {
    const messageEndRef =useRef(null)
    const [chat , setChat] = useState(null)
    const [disabled , isDisabled] = useState(false)
    const [loading , setLoading] = useState(false)
    const [isOpen , setOpen] = useState(false)
    const [message , setMessage] = useState([{from: 'bot' , text: "How can i help you!"}])
    const [input , setInput] = useState('')
    useEffect(()=>{
        if(messageEndRef.current){
            messageEndRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [message,loading])
    useEffect(()=>{
        const setupChat = async ()=>{
            setLoading(true)
            const chatModel = await getChatModel()
            setChat(chatModel)
        }
        setupChat()
        setLoading(false)
}, [])
    if(!process.env.REACT_APP_API_KEY){
        console.log("Api Key is missing")
    }
    const handleopen=()=>{
       
        setOpen((prev)=> !prev)
    }
    useEffect(() => {
        const el = document.querySelector(".chatbot-messages");
        if (el) el.scrollTop = el.scrollHeight;
}, [message]);

    const handleInput = async ()=>{
        if(input.trim()=== '') return
        const userMessage = {role: 'user' , text: input}
        setMessage([...message , userMessage])
        setInput('')
        setLoading(true)
        isDisabled(true)
        const botMessage = {role: 'bot' , text: ""}
        setMessage(prev=>[...prev ,botMessage])
        const result = await chat.sendMessageStream(input)
        let streamedText = ""
        for await (const chunk of result.stream){
            const chunkText = chunk.text()
            streamedText += chunkText
            setMessage((prev)=>
                prev.map((msg , i)=>
                    i=== prev.length-1 ? {...msg , text: streamedText}: msg
                )
            )
        }
        setLoading(false)
        isDisabled(false)
    }
  return (
    <>
        <div className="chatbot-container">
            <button className="chatbot-toggle" onClick={handleopen}>
                <img
                src="/icons8-chatbot-32.png"
                alt="chat-bot"
                className="chatbot-icon"
                />
            </button>
        </div>
        {isOpen &&
            <div className="chatbot-box">
                <div className="chatbot-header">
                    <span>Chatbot</span>
                    <button className="close-btn" onClick={()=> setOpen(false)}>❌</button>
                </div>
                <div className="chatbot-messages">
                    {message.map((msg , index)=>(
                        <div key={index} className={`chatbot-message ${msg.role}`}>
                            <Markdown>{msg.text}</Markdown>
                        </div>
                    ))}
                    {loading && <div className="chatbot-message bot">Typing...</div>}
                    <div ref={messageEndRef}></div>
                </div>
                <div className="chatbot-input-area">
                    <input value={input} type="text" 
                    disabled={disabled}
                    onChange={(e)=>setInput(e.target.value)}
                    onKeyDown={(e)=> e.key === 'Enter' && handleInput()}
                    placeholder="Type your message">
                    </input>
                    <button disabled={disabled} onClick={handleInput}><img alt="send" style={{height:'20px' , width: '20px'}} src="/internet.png"></img></button>
                </div>
            </div>
            
        }
    </>
  )
}
