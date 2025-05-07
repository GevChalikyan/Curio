const API_BASE_URL = "https://api-connection-pdoi.onrender.com"

const LOGIN_PAGE = `
<form>
  <label for="username">Username:</label>
  <input type="text" id="username" name="username"><br><br>
  <label for="password">Password:</label>
  <input type="text" id="password" name="password"><br><br>
  <input type="submit" value="Submit">
</form>
`;

const WELCOME_PAGE = `
<H1>
  <i>
    <b>
       <div>
        <div class="switch-container">
          <label class="switch">
            <input type="checkbox" id="highlight-toggle">
            <span class="slider"></span>
          </label>
            <span class="switch-label">Element Highlighter</span>
        </div>
      </div>
    </b>
  </i>
</H1>
`;



function updateMainPage(ok) {
  const container = document.getElementById('mainPage');
  if (ok) {
    container.innerHTML = WELCOME_PAGE;
    
    const toggle = document.getElementById("highlight-toggle");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      toggle.addEventListener("change", () => {
        chrome.tabs.sendMessage(tab.id, {
          action: "toggle_element_selection"
        });
      });
    });

  } else {
    container.innerHTML = LOGIN_PAGE;
  }
}

 

(async function() {
  console.log("Popup Page Opened");
  try{
    
    const response = await fetch(`${API_BASE_URL}/ping`); // To be replaced with login call
    if (!response.ok) throw new Error(`${response.status}`);

    const { message } = await response.json();
    updateMainPage(message === 'pong');

  } catch(error) {
    console.error('Error Communicating with Server: ',error);
    updateMainPage(false);
  }
})();