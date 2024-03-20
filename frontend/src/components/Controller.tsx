import axios from 'axios'
import { useState } from 'react'
import RecordMessage from './RecordMessage'
import Title from './Title'

function Controller() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  const createBlobUrl = (data: any) => {
    const blob = new Blob([data], { type: 'audio/mpeg' })
    const url = window.URL.createObjectURL(blob)
    return url
  }

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true)
    // appned recorded message to messages
    const myMessage = { sender: 'me', blobUrl }
    const messagesArr = [...messages, myMessage]

    // convert blob url to blob object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        // construct audion to send file
        const formData = new FormData()
        formData.append('file', blob, 'myFile.wav')

        // send form data to api endpoint
        await axios
          .post('http://localhost:8001/post-audio', formData, {
            headers: { Content_Type: 'audio/mpeg' },
            responseType: 'arraybuffer',
          })
          .then((res: any) => {
            const blob = res.data
            const audio = new Audio()
            audio.src = createBlobUrl(blob)

            // append to audio
            const saraMessage = { sender: 'sara', blobUrl: audio.src }
            messagesArr.push(saraMessage)
            setMessages(messagesArr)

            // play audio
            setIsLoading(false)
            audio.play()
          })
          .catch((err) => {
            console.log(err.message)
            setIsLoading(false)
          })
      })
  }
  return (
    <div className="h-screen overflow-y-hidden">
      <Title setMessages={setMessages} />
      <div className="flex flex-col justify-between overflow-y-scroll pb-96">
        {/* Coversation */}
        <div className="mt-5 px-5">
          {messages.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  'flex flex-col ' +
                  (audio.sender == 'sara' && 'flex items-end')
                }
              >
                {/* Sender */}
                <div className="mt-4">
                  <p
                    className={
                      audio.sender == 'sara'
                        ? 'text-end mr-2 italic text-green-500'
                        : 'ml-2 italic text-blue-500'
                    }
                  >
                    {audio.sender}
                  </p>
                  {/* Audio Message */}
                  <audio
                    src={audio.blobUrl}
                    controls
                    className="appearance-none"
                  />
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              Give me a few seconds...
            </div>
          )}
        </div>
        {/* Recorder */}
        <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-sky-500 to-green-500">
          <div className="flex justify-center items-center w-full">
            <RecordMessage handleStop={handleStop} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controller
