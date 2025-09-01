"use client"


import { flow } from "@/chatBot/chatbotFlow";
import ChatBot from "react-chatbotify";



const ChatBotValidatorPage = () => {
 
  return (
    <div className="flex w-full h-[100vh] justify-center items-center">
      <ChatBot  styles={{    botBubbleStyle:{backgroundColor: "#42b0c5"},
      userBubbleStyle:{backgroundColor:"#8b93fb"}}}
        settings={{
          general: {
            embedded: true,
          },
          chatWindow: {
            defaultOpen: true,
          },
          header: {
            title: (
              <span
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                BMO BOT
              </span>
            ),
            avatar: "/avatar/chat-avatar.png",
            buttons: [],

          },
          userBubble: { showAvatar: true },
          botBubble: { showAvatar: true, avatar: "/avatar/chat-avatar.png", },
          chatInput: { botDelay: 1500 },
    
          
          footer: {
            text: "",
            buttons: []
          },
          notification: {
            disabled: true
          }
        }}
        flow={flow}
      />
    </div>
  );
};
export default ChatBotValidatorPage