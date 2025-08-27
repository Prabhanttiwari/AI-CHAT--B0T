let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");

const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBhhOlQQ512HW3h2zjj6Q49SI4uMkjvw6A";

let user = {
  data: null,
};

async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");

  let requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: user.data }],
        },
      ],
    }),
  };

  try {
    let response = await fetch(Api_url, requestOptions);
    let data = await response.json();
    let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    text.innerHTML = apiResponse;
  } catch (error) {
    console.error("API Error:", error);
    text.innerHTML = "Something went wrong. Please try again.";
  }



  finally{
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
  }




}

function createChatBox(html, className) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(className);
  return div;
}

function handleChatResponse(message) {
  user.data = message;
  if (!message.trim()) return;

  let userHtml = `
    <img src="user.png" alt="User" class="chat-image user-img">
    <div class="user-chat-area chat-bubble">
      ${user.data}
    </div>
  `;
  prompt.value = "";
  let userChatBox = createChatBox(userHtml, "user-chat-box");
  chatContainer.appendChild(userChatBox);
  chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

  setTimeout(() => {
    let aiHtml = `
      <img src="ai.png" alt="AI" class="chat-image ai-img">
      <div class="ai-chat-area chat-bubble">
        <img src="loading.gif" alt="Loading" class="load" width="30">
      </div>
    `;
    let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 400);
}

prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleChatResponse(prompt.value);
  }
});
