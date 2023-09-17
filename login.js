console.log("Hey login")

// Hide and show password 
document.querySelector('[showpassword]').addEventListener('click', () => {
    document.querySelector('[hidepass]').classList.toggle('hide')
    document.querySelector('[showpass]').classList.toggle('opacity')
    var pass = document.querySelector('[password]')
    if(pass.type === "password") {
        pass.type = "text";
      } else {
        pass.type = "password";
      }
    })

// Animation on input label 
document.querySelectorAll('[input]').forEach((input) => {
	input.addEventListener('focus', () => {
  input.nextElementSibling.classList.add('active')
 })
 
 input.addEventListener('focusout', () => {
 	if(input.value == ""){
  input.nextElementSibling.classList.remove('active')
  }
 })
 })


 document.querySelector('[login]').addEventListener('click', (e) => {
    e.preventDefault()
    // if both fields are filled, warnings if not
    document.querySelector('[email]').classList.remove('empty'); 
    document.querySelector('[password]').classList.remove('empty'); 
    if(document.querySelector('[email]').value && document.querySelector('[password]').value) loginUser();
    else if(!document.querySelector('[email]').value){
    document.querySelector('[email]').classList.add('empty'); document.querySelector('[emptyfields]').classList.add('show'); setTimeout(() => document.querySelector('[emptyfields]').classList.remove('show'), 3000);
    } else if (!document.querySelector('[password]').value){
    document.querySelector('[password]').classList.add('empty'); document.querySelector('[emptyfields]').classList.add('show'); setTimeout(() => document.querySelector('[emptyfields]').classList.remove('show'), 3000);
    }
  })

  async function loginUser(){
    // appending email and password to the APi call to authenticate user
    var urllogin = new URLSearchParams()
    urllogin.append("Email", document.querySelector('[email]').value)
    urllogin.append("Password", document.querySelector('[password]').value)
    try{
    const res = await fetch("https://x8ki-letl-twmt.n7.xano.io/api:J2qjdVBc/auth/login",
    {
    method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Access-Control-Allow-Origin': window.location.href
      },
      body: urllogin
    })
    const data = await res.json()
    // if anthentication is successful, create a cookie with the auth token with an expiration date of 1 month
    if(res.status === 200){
      const name = encodeURIComponent("lacToken");
      const token = encodeURIComponent(data.authToken)
      const date = new Date().setMonth(new Date().getMonth() + 1)
      document.cookie = `${name}=${token}; expires=${date}; path=/; domain=lake-atitlan-community.webflow.io`
      // if authentication is not successful, display error message  
    } else document.querySelector('[invalidfields]').classList.add('show'); setTimeout(() => {document.querySelector('[invalidfields]').classList.remove('show')}, 3000)
    } catch(error){
    console.log('error:', error);
    throw error;
    }
    }  
