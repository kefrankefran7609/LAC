var dundasCountry
var dundasUserType
window.onload = async () => {
   function getCookie(name) {
      var cookies = document.cookie.split('; ');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split('=');
        if (cookie[0] === name) {
          return decodeURIComponent(cookie[1]);
        }
      }
      return null;
    }
    dundasCountry = getCookie('dundasCountry')
    dundasUserType = getCookie('dundasUserType')
    if(dundasCountry){
      document.querySelectorAll('[radioflag]').forEach(el => {
      if(el.value == dundasCountry.replace(/_/g, ' ')) { 
        el.parentElement.classList.add('is-active') // Make the radio-button for country active
        document.querySelectorAll('[flag]').forEach(els => { // Update the flag in the nav
            els.src = el.nextElementSibling.src
           })
           document.querySelectorAll('[flag]').forEach(els => {
            els.srcset = el.nextElementSibling.srcset
           })
        document.querySelector('[country]').textContent = dundasCountry.replace(/_/g, ' ') // Update the name of the country in the nav
    }})
    } else {
      document.querySelector('input[type="radio"][value="UK"]').parentElement.classList.add('is-active') // Make UK active if no cookie
    } 
    if(dundasUserType){
      if(dundasCountry.replace(/_/g, ' ') == "Professional investor") {
      document.querySelector('[professional]').classList.add('is-active')
      document.querySelector('[investortype]').textContent = dundasCountry.replace(/_/g, ' ')
      }
      else {
      document.querySelector('[nonprofessional]').classList.add('is-active')
      document.querySelector('[investortype]').textContent = "Non-professional investor"
      }
    } else document.querySelector('[professional]').classList.add('is-active')
}

//Open nav main dropdown
document.querySelector('[openmaindropdown]').addEventListener('click', () => {
  document.querySelector('[maindropdown]').classList.toggle('show')
  document.querySelector('[maindropdownarrow]').classList.toggle('show')
})

//Close nav main dropdown
function closeDropdown(){
document.querySelector('[closedropdown]').addEventListener('click', () => {
  document.querySelector('[maindropdown]').classList.remove('show')
  document.querySelector('[maindropdownarrow]').classList.remove('show')
  document.querySelector('[locationdropdowncontent]').classList.remove('show') 
  document.querySelector('[usertypedropdowncontent]').classList.remove('show') 
})}
closeDropdown()

document.querySelector('[locationtoggle]').addEventListener('click', () => {
  document.querySelector('[locationdropdowncontent]').classList.toggle('show') 
})

document.querySelector('[usertypetoggle]').addEventListener('click', () => {
  document.querySelector('[usertypedropdowncontent]').classList.toggle('show') 
})



// Changing country
function changeCountry(){
document.querySelectorAll('[radioflag]').forEach(el => { // when a country is selected
  el.addEventListener('change', (e) => {
      if(!e.target.classList.contains('is-active')){
       document.querySelectorAll('.radio-button').forEach(els => { // remove active class on all countries
        els.classList.remove('is-active')
       })  
       e.target.parentElement.classList.add('is-active') // add active class on the selected one
       document.querySelectorAll('[flag]').forEach(el => { // Update the flag in the nav
        el.src = e.target.nextElementSibling.src
       })
       document.querySelectorAll('[flag]').forEach(el => {
        el.srcset = e.target.nextElementSibling.srcset
       })
      document.querySelector('[country]').textContent = e.target.parentElement.lastChild.textContent // Update the country text in the nav
       const country = encodeURIComponent(e.target.value.replace(/ /g, '_'))
       document.cookie = `dundasCountry=${country}`                 
      }
  })
})
}
changeCountry()


// Selecting a user type
function changeUserType(){
document.querySelectorAll('.nav_top-dropdown-type').forEach(el => {
  el.addEventListener('click', (e) => {
  if(!e.target.classList.contains('is-active')){  
  document.querySelectorAll('.nav_top-dropdown-type').forEach(els => {
    els.classList.remove('is-active')
  })
  e.target.classList.add('is-active')
  document.querySelector('[investortype]').textContent = e.target.id.replace(/_/g, ' ')
  const userType = encodeURIComponent(e.target.id.replace(/_/g, ' '))
  document.cookie = `dundasUserType=${userType}`
  }
  })
})
}
changeUserType()
