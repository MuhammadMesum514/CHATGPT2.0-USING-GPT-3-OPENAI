import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import axios from "axios";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

//* showing loader when bot is typing
function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += ".";

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

//* typing animation

function typingAnimation(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

//* generating unique id
function generateId() {
  const timeStamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const hexaDecimal = random.toString(16);
  return `id-${timeStamp}-${hexaDecimal}`;
}

//* creating chat strip for both bot and user
function ChatStrips(isAi, value,uniqueId) {
 return`
 <div class="wrapper ${isAi && "ai"} >
 <div class="chat">
 <div class="profile">
 <img src="${isAi ? bot : user}" alt="${isAi?'Bot':'User'}" />
 </div>
 <div class="message" id="${uniqueId}">
  ${value} 
 </div>
 </div>
 </div>
 `
}


//* sending message to bot
// debugger;
const sendMessageToBot = async(e)=>{
  e.preventDefault();
  const data= new FormData(form);
  //* user's message
  chatContainer.innerHTML += ChatStrips(false, data.get("chat"), generateId());
  form.reset();
  //* bot's message
  const uniqueId = generateId();
  chatContainer.innerHTML += ChatStrips(true, "", uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const body = { prompt: JSON.stringify(data.get("chat"))};
  const response = await axios.post("http://localhost:5000",body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML ='';
  if(response.status===200){
    const parsedData = await response.data.bot.trim();
    // const parsedData = data.bot.trim();
    typingAnimation(messageDiv,parsedData);
  }
  else{
    messageDiv.textContent="Something went wrong";
  }
}

form.addEventListener("submit", sendMessageToBot);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    sendMessageToBot(e);
  }
});


