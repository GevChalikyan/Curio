const API_BASE_URL = "https://curio-backend-d13s.onrender.com"

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
      YURRRRRRR
    </b>
  </i>
</H1>
`;



function updateMainPage(ok) {
  const container = document.getElementById('mainPage');
  if (ok) {
    container.innerHTML = WELCOME_PAGE;
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