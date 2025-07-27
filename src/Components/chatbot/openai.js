import axios from 'axios'
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY
export const getOpenAIResponse = async (userInput) =>{
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: "gpt-4.1" ,
            message: [
                {
                    role: "system",
                    content: "You are a helpful assistant for an e-commerce website. Answer queries about products, categories, and how to use the site."

                },
                {
                    role: "User",
                    content: userInput
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            }
        }    
    )
    return response.data.choices[0].message.content
}