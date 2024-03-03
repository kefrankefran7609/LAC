console.log("hey dashboardyy")

/***** Authentication *****/ 
window.onload = async () => {
    // Find auth token cookie
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim(); 
    auth = cookie.startsWith("lacToken" + '=')  ? cookie.substring("lacToken".length + 1) : ""    
  } 
    if(auth){
    //Authenticate user and get his items
    authUser(auth)
}  else location.href = "https://lake-atitlan-community.webflow.io/authentification/log-in" // Redirect if no there isn't an auth token
}

const URL = "https://xbwk-4swk-vecw.n2.xano.io/api:J2qjdVBc/"
var userid 

const settings = {method: 'GET',
headers: {
       'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*'
     }
    }

allItems = []  
async function getItems(id, endpoint) {
	try{
  const res = await fetch(URL + endpoint + "?userid=" + id, settings)
  const data = await res.json()
  allItems.push(...data)
  } catch(error){
  console.log('error:', error);
  throw error;
  }
}

// Auth user 
async function authUser(auth) {
	try{ 
  const res = await fetch(URL + "auth/me", {
 method: 'GET',
 headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': window.location.href,
        'Authorization': 'Bearer ' + auth
      }
 })
  if(res.status == 200){
    const data = await res.json()
    document.querySelectorAll('[showloggedin]').forEach(el => {        
      el.style.display = "block" 
      })
    id = data.id
    plan = data.plan
    userEmail = data.Email
    document.querySelector('[plan]').textContent = "Estás con el plan" + plan
    document.querySelector('[username]').textContent = "Welcome " + data.First_name
    
    // Get all items of the user
    const promises = [
    getItems(id, "marketplace"),
    getItems(id, "events"),
    getItems(id, "estates"),
    getItems(id, "restaurants"),
    getItems(id, "services")
    ]

    // Wait for all Promises to resolve and then create items from the combined list
    await Promise.all(promises);
    const itemTemplate = document.querySelector('[item]')
    const itemList = itemTemplate.parentElement
    itemTemplate.remove()
    if(allItems.length == 0) { document.querySelector('[loaderwrapper').style.display = "none"; document.querySelector('[loadingcontent]').classList.add('show'); document.querySelector('[itemsempty]').style.display = "block"; console.log("hey") }
    else {
    const items = allItems.map(({name, thumbnail, id, type, status}) => {
    const item = itemTemplate.cloneNode(true)
    item.querySelector('[itemid]').textContent = id
    item.querySelector('[itemname]').textContent = name
    item.querySelector('[itemtype]').textContent = type
    item.querySelector('[thumb]').src = thumbnail.url
    var typesss = type
    /* Remove popups of other types
    item.querySelectorAll('[editpopup]').forEach(el => {
      if(!el.hasAttribute(`${type}`)){
      el.remove()
      console.log("removed")
      }
    })
    */
    // Updating user info 
    if(plan == "premium") {
      if(status == "live") item.querySelector('[openarchive]').style.display = "block"; else item.querySelector('[openunarchive]').style.display = "block";
    }
    return item
    })
    if(plan == "basic") {
      document.querySelector('[upgrade]').style.display = "block"
      if(items.length > 11) document.querySelector('[createwrapper]').remove()
      }
      document.querySelector('[postnumber]').textContent = items.length < 10 ? "Tienes " + items.length + " postes, te quedan " + 10 - items.length + " postes incluyendo con tu plan" : "Usaste todos tus 10 postes de tu plan"
      document.querySelector('[postnumber]').style.display = plan == "premium" || items.length == 0 ? "none" : "block"
      if(plan == "premium") document.querySelector('[downgrade]').style.display = "block"

    itemList.append(...items)
    // Hide loader and show content
    setTimeout(() => {
      document.querySelector('[loaderwrapper').style.display = "none"
      document.querySelector('[loadingcontent]').classList.add('show')
    }, 1000)

    /*****  Delete, archive, unarchive item *****/
    const confirmWrapper = document.querySelectorAll('[confirmwrapper]')
    const confirmBody = document.querySelectorAll('[confirmbody]')  
    const openDelete = document.querySelectorAll('[opendelete]')
    const openArchive = document.querySelectorAll('[openarchive]')
    const openUnarchive = document.querySelectorAll('[openunarchive]')
    const deleteItem = document.querySelectorAll('[delete]')
    const archive = document.querySelectorAll('[archive]')
    const unarchive = document.querySelectorAll('[unarchive]')
    const close = document.querySelectorAll('[closealert]')

    // Delete item
    openDelete.forEach((btn, index) => {
    btn.addEventListener('click', () => {
    confirmWrapper[index].classList.add('open')
    deleteItem[index].style.display = "block"
    setTimeout(() => {
    confirmBody[index].classList.add('open')
    }, 500)
    setTimeout(() => {
    close[index].classList.add('open')
    }, 600)
    }) 
    })

    close.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      confirmWrapper[index].classList.remove('open')
      confirmBody[index].classList.remove('open')
      close[index].classList.remove('open')
      deleteItem[index].style.display = "none"
      })
    })

    deleteItem.forEach(btn => {
      btn.addEventListener('click', (e) => {
      const parent = btn.closest('.marketplace_item-body')
      updateItem(parent.querySelector('[itemid]').textContent, parent.querySelector('[itemtype]').textContent, "DELETE", "delete", e.target) 
      }) 
    })
    // End of creating delete event listener

    // archive item
      openArchive.forEach((btn, index) => {
      btn.addEventListener('click', () => {
      confirmWrapper[index].classList.add('open')
      archive[index].style.display = "block"
      setTimeout(() => {
      confirmBody[index].classList.add('open')
      }, 500)
      setTimeout(() => {
      close[index].classList.add('open')
      }, 600)
      }) 
      })
  
      close.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        confirmWrapper[index].classList.remove('open')
        confirmBody[index].classList.remove('open')
        close[index].classList.remove('open')
        archive[index].style.display = "none"
        })
      })
  
      archive.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
        const parent = btn.closest('.marketplace_item-body')
        updateItem(parent.querySelector('[itemid]').textContent, parent.querySelector('[itemtype]').textContent, "POST", "archive", e.target) 
        }) 
      })
      // End of creating unarchive event listener

      // unarchive item
      openUnarchive.forEach((btn, index) => {
        btn.addEventListener('click', () => {
        confirmWrapper[index].classList.add('open')
        unarchive[index].style.display = "block"
        setTimeout(() => {
        confirmBody[index].classList.add('open')
        }, 500)
        setTimeout(() => {
        close[index].classList.add('open')
        }, 600)
        }) 
        })
    
        close.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          confirmWrapper[index].classList.remove('open')
          confirmBody[index].classList.remove('open')
          close[index].classList.remove('open')
          unarchive[index].style.display = "none"
          })
        })
    
        unarchive.forEach((btn, index) => {
          btn.addEventListener('click', (e) => {
          const parent = btn.closest('.marketplace_item-body')
          updateItem(parent.querySelector('[itemid]').textContent, parent.querySelector('[itemtype]').textContent, "POST", "unarchive", e.target) 
          }) 
        })
        // End of creating unarchive event listener
      } // End of if statement if there are items
    } else location.href = "https://lake-atitlan-community.webflow.io/authentification/log-in"  // Redirect if auth fails
  } catch(error){
  console.log('error:', error);
  throw error;
  }
}
/***** End of authentication *****/

// Function to delete, archive & unarchive item
async function updateItem(id, type, method, action, el){
  try{
    const res = await fetch(URL + type + "/" + id + "?id=" + id + (action == "archive" ? "&status=archived" : action == "unarchive" ? "&status=live" : ""),
    {
    method: method,
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*'
      }
    })
    console.log(res)
    if(res.status === 200){
    if(method == "DELETE") el.closest('.item').remove()
    const parent = el.closest('.marketplace_item-body')
    if(action == "archive"){
    parent.querySelector('[openarchive]').style.display = "none"
    parent.querySelector('[openunarchive]').style.display = "block"
    parent.querySelector('[closealert]').click()
    }
    if(action == "unarchive"){ 
    parent.querySelector('[openarchive]').style.display = "block"
    parent.querySelector('[openunarchive]').style.display = "none"
    parent.querySelector('[closealert]').click()
    }
    //if(action == "update") document.querySelectorAll('[item]')[index].remove()
    }
  } catch(error){
      console.log('error:', error);
      throw error;
      }
    }
/*****  End of delete, archive, unarchive item *****/


// Empty the value of auth token to logout and redirect to homepage
document.querySelector('[logout]').addEventListener('click', () => {
  document.cookie = "lacToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=lake-atitlan-community.webflow.io;"
  window.location.href = "/"
})

 
/***** Side menus *****/
/* Menu for Side sections - FAQ, Rules & Tips */
$("#faq, #rule, #tip").click(function(){ 
  $('.dashboard_side-sections-wrapper').addClass('show');
  $('[closearrow]').addClass('show');
  $('[closearrow]').css('pointer-events', 'auto')
  document.body.style.overflow = "hidden" //Disable page scroll
  })

/* Close Menu for Side sections */
$("[closearrow]").click(function(){ 
	$('.dashboard_side-sections-wrapper').removeClass('show');
  $('.dashboard_side-section').removeClass('show');
  $('[closearrow]').removeClass('show');
  $('[closearrow]').css('pointer-events', 'none')
  document.body.style.overflow = "auto" //Disable page scroll
  })
 
$("#faq").click(function(){
	$('.dashboard_side-section').not('.is--faq').removeClass('show')
	setTimeout(function() { 
    $('#faqs').addClass('show');
    }, 600);
  }) 
  
$("#rule").click(function(){
	$('.dashboard_side-section').not('.is--rules').removeClass('show')
	setTimeout(function() { 
    $('#rules').addClass('show');
    }, 600);
  }) 
  
  $("#tip").click(function(){
	$('.dashboard_side-section').not('.is--tips').removeClass('show')
	setTimeout(function() { 
    $('#tips').addClass('show');
    }, 600);
  }) 
   
// Tooltips     
tippy('[infodescription]', {
        content: '700 characters maximum.<br> To count characters: https://wordcounter.net/',
      	allowHTML: true,
      });
      
tippy('[infoemail]', {
        content: 'If this field is left empty, the email from your account will be displayed',
      });
      
tippy('[infoprice]', {
        content: 'Only numbers, the Q sign will be added automatically, if free write 0.',
      });  
      
tippy('[infowebsite]', {
        content: 'Link to your website, Facebook page or Instagram for example',
      }); 

tippy('[infovideo]', {
        content: 'Link to a Youtube or Vimeo video for example',
      }); 

tippy('[infomap]', {
        content: 'Link to your google map location',
      });

tippy('[infoplaces]', {
        content: 'How many places to sleep, 1 queen/king bed is usually 2 places, a large couch can be counted as a 1 place',
      });

tippy('[infodays]', {
        content: 'Monday to Friday or Everyday',
      }); 

tippy('[infohours]', {
        content: 'Example: 8am till 6pm, if you have different hours for some days, mention it in the description or add an image with your whole schedule',
      }); 

tippy('[inforecurring]', {
        content: 'If your event is happening at the same time every week, select yes and your event will automatically be renewed every week. If not your event will be deleted automatically at the end of the event',
      });

tippy('[infothumbnail]', {
        content: 'Maximum size of 300kb, the perfect dimensions are 300 x 450, you have to upload a thumbnail',
      });
      
tippy('[infoimages]', {
        content: 'Maximum size of 600kb, the perfect dimensions are 600 x 900, you need to upload at least 1 main image', 
      }); 
      
tippy('[soon]', {
        content: 'Próximamente', 
      });  


/* Open create item popup */
const createPopups =  document.querySelectorAll('[createpopup]')
document.querySelectorAll('[opencreatepopup]').forEach((el, index) => {
el.addEventListener('click', () => {
document.querySelector('[popup]').classList.add('show')
setTimeout(() => {
createPopups[index].classList.add('show')
}, 50)
document.body.style.overflow = "hidden" //Disable page scroll
})
})

/* Close create item popup */
document.querySelectorAll('[closecreateitempopup]').forEach((el, index) => {
el.addEventListener('click', () => {  
createPopups[index].classList.remove('show')
setTimeout(() => {
document.querySelector('[popup]').classList.remove('show')
}, 500)
document.body.style.overflow = "auto" //Disable page scroll
// Empty fields
document.querySelectorAll('[thumbfail], [thumbsuccess], [image1success], [image1fail], [image2success], [image2fail], [image3success], [image3fail], [image4success], [image4fail], [image5success], [image5fail]').forEach(els => {
els.classList.remove('show')
})
images = []
thumb = ""
document.querySelectorAll('[createname], [thumbheading], [categoriesheading], [createnombre], [createwho], [createdescription], [createdescripcion], [datestart], [createprice], [imageheading], [townsheading]').forEach(el => {
  el.classList.remove('empty')
})
})
})


/* Check all towns on click */
document.querySelectorAll('[checkalltowns]').forEach((btn, index) => { 
  btn.addEventListener('click', () => {
  townsWrapper = document.querySelectorAll('[townswrapper]')[index]  
  townsWrapper.querySelectorAll('input[towns], input[uncheck]').forEach((box) => {
  box.checked = true
  })
  btn.style.opacity = "0"
  document.querySelectorAll('[uncheckalltowns]')[index].style.display = "block"
  })
})

/* Uncheck all towns on click */
document.querySelectorAll('[uncheckalltowns]').forEach((btn, index) => { 
  btn.addEventListener('click', () => {
  townsWrapper = document.querySelectorAll('[townswrapper]')[index]
  townsWrapper.querySelectorAll('input[towns], input[check]').forEach((box) => {
  box.checked = false
  })
  btn.style.display = "none"
  document.querySelectorAll('[checkalltowns]')[index].style.opacity = "1"
  })
})

/* Giving default value to hidden fields*/
document.querySelectorAll('input[hiddenfilled], input[minutesstart], input[minutesend]').forEach(input => {
  input.value = "00"
  input.addEventListener('change', (e) => {        
    if(e.target.value === "0"){
    input.value = "00"
    }
    })
 })

document.querySelectorAll('input[hoursstart], input[hoursend]').forEach(input => { 
  input.value = 1
})

/* Upload thumbnail */
var thumb
document.querySelectorAll('input[uploadthumbnail]').forEach(input => {
  input.addEventListener('change', (ev) => {
    let reader = new FileReader()
    reader.onload = (event) => {
      let image_url = event.target.result
      let image = new Image()
      image.src = image_url
      let width = 600
      image.onload = (e) => {
        let canvas = document.createElement("canvas")
        let ratio = width / e.target.width
        canvas.width = width
        canvas.height = e.target.height * ratio
        const context = canvas.getContext("2d")
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        let new_image_url = context.canvas.toDataURL("image/webp", 0.9)
        urlToFile(new_image_url)
      };
    };
    reader.readAsDataURL(ev.target.files[0])
  });
});

let urlToFile = (url) => {
  let arr = url.split(",")
  let mime = arr[0].match(/:(.*?);/)[1]
  let data = arr[1]
  let dataString = atob(data)
  let n = dataString.length
  let dataArr = new Uint8Array(n)
  while (n--) {
    dataArr[n] = dataString.charCodeAt(n)
  }
  let file = new File([dataArr], 'File.png', {type: mime})
  console.log(file)
  createImage(file, "thumb")
};

/* Upload image 1 */
var image1
document.querySelectorAll('input[uploadimage1]').forEach(btn => {
  btn.addEventListener('change', (e) => {
    createImage(e.target.files[0], "image1")
  })
})

/* Upload image 2 */
var image2
document.querySelectorAll('input[uploadimage2]').forEach(btn => {
  btn.addEventListener('change', (e) => {
    createImage(e.target.files[0], "image2")
  })
})

/* Upload image 3 */
var image3
document.querySelectorAll('input[uploadimage3]').forEach(btn => {
  btn.addEventListener('change', (e) => {
    createImage(e.target.files[0], "image3")
  })
})

/* Upload image 4 */
var image4
document.querySelectorAll('input[uploadimage4]').forEach(btn => {
  btn.addEventListener('change', (e) => {
    createImage(e.target.files[0], "image4")
  })
})

/* Function to upload image */
var images = []
async function createImage(file, type, i){
  const fileData = new FormData()
    fileData.append('file', file)
    try{
      const res = await fetch(URL + "upload/image"
      , {
      method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: fileData
      })
      console.log(res)
      const data = await res.json()
      console.log(data)
      
      // Create index because ther is a problem with keeping the index of sync function
      const pop = document.querySelector('.popup.is--create.show')
      const i = Array.from(document.querySelectorAll('[createpopup]')).indexOf(pop)
      const sizeTips = document.querySelectorAll('[uploadsizetips]')
      for (var d = 0; d < 10; d++){
        if(type == "thumb"){       
          if(data.size < 300001) {
          const size = (data.size.toString()).slice(0, -3)
          document.querySelectorAll('[thumbfail]')[i].classList.remove('show')
          document.querySelectorAll('[thumbsize]')[i].textContent = size + "KB"
          document.querySelectorAll('[thumbsuccess]')[i].classList.add('show')
          thumb = JSON.stringify(data)
          break;
          } else document.querySelectorAll('[thumbfail]')[i].classList.add('show'); document.querySelectorAll('[thumbsuccess]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;
        }
        if(type == "image1") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image1fail]')[i].classList.remove('show')
            document.querySelectorAll('[image1size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image1success]')[i].classList.add('show')
            image1 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image1fail]')[i].classList.add('show'); document.querySelectorAll('[image1success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;          
        }  
        if(type == "image2") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image2fail]')[i].classList.remove('show')
            document.querySelectorAll('[image2size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image2success]')[i].classList.add('show')
            image2 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image2fail]')[i].classList.add('show'); document.querySelectorAll('[image2success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }  
        if(type == "image3") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image3fail]')[i].classList.remove('show')
            document.querySelectorAll('[image3size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image3success]')[i].classList.add('show')
            image3 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image3fail]')[i].classList.add('show'); document.querySelectorAll('[image3success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }  
        if(type == "image4") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image4fail]')[i].classList.remove('show')
            document.querySelectorAll('[image4size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image4success]')[i].classList.add('show')
            image4 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image4fail]')[i].classList.add('show'); document.querySelectorAll('[image4success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }  
        if(type == "image5") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image5fail]')[i].classList.remove('show')
            document.querySelectorAll('[image5size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image5success]')[i].classList.add('show')
            image5 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image5fail]')[i].classList.add('show'); document.querySelectorAll('[image5success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }  
        if(type == "image6") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image6fail]')[i].classList.remove('show')
            document.querySelectorAll('[image6size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image6success]')[i].classList.add('show')
            image6 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image6fail]')[i].classList.add('show'); document.querySelectorAll('[image6success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }  
        if(type == "image7") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image7fail]')[i].classList.remove('show')
            document.querySelectorAll('[image7size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image7success]')[i].classList.add('show')
            image7 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image7fail]')[i].classList.add('show'); document.querySelectorAll('[image7success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }  
        if(type == "image8") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image8fail]')[i].classList.remove('show')
            document.querySelectorAll('[image8size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image8success]')[i].classList.add('show')
            image8 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image8fail]')[i].classList.add('show'); document.querySelectorAll('[image8success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }  
        if(type == "image9") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image9fail]')[i].classList.remove('show')
            document.querySelectorAll('[image9size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image9success]')[i].classList.add('show')
            image9 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image9fail]')[i].classList.add('show'); document.querySelectorAll('[image9success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }  
        if(type == "image10") {
          if(data.size < 600001) {
            const size = (data.size.toString()).slice(0, -3)
            document.querySelectorAll('[image10fail]')[i].classList.remove('show')
            document.querySelectorAll('[image10size]')[i].textContent = size + "KB"
            document.querySelectorAll('[image10success]')[i].classList.add('show')
            image10 = JSON.stringify(data)
            break;
            } else document.querySelectorAll('[image10fail]')[i].classList.add('show'); document.querySelectorAll('[image10success]')[i].classList.remove('show'); sizeTips[i].classList.add('show'); break;     
        }            
      }
      images = []
  if(image1) images.push(image1)
  if(image2) images.push(image2)
  if(image3) images.push(image3)
  if(image4) images.push(image4)
  console.log(images)
      } catch(error){
      console.log('error:', error);
      throw error;
      }
}

// Displaying invalid message for invalid email in the create popups
document.querySelectorAll('[createemail]').forEach(btn => {
  btn.addEventListener('blur', (e) => { 
  if(e.target.value == "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)){
  e.target.classList.remove('empty'); e.target.nextElementSibling.textContent = "Email"; e.target.nextElementSibling.style.color = "#767676" 
  }
  else { e.target.classList.add('empty'); e.target.nextElementSibling.textContent = "Invalid email"; e.target.nextElementSibling.style.color = "#c00" }
})})

document.querySelectorAll('[createemail]').forEach(btn => {
  btn.addEventListener('blur', (e) => { 

  })
})

/****** Create an item on click ******/
document.querySelectorAll('[createitembutton]').forEach((btn, index) => {
btn.addEventListener('click', async (e) => {
  e.preventDefault()
  

  const categories = []
  const categorias = []
  const options = []
  const opciones = []
  const types = []
  const tipos = []
  const drinks = []
  const bebidas = []
  const payments = []
  const pagos = []
  const others = []
  const otros = []
  /* Get categories */
  categoriesWrapper = document.querySelectorAll('[categorieswrapper]')[index]
  checkboxesCategories = categoriesWrapper.querySelectorAll('input[categories]')
  /* Looping through the checkboxes, keep the ones that are checked and create 1 array for each language */
  Array.from(Array.from(checkboxesCategories).filter((checkbox) =>   checkbox.checked).map((check) => check.id.replace(/_/g, ' '))).map(function(item){
    const parts = item.split('-');
    categories.push(parts[0])
    categorias.push(parts[1])
    })

    /* Get options */
  checkboxesOptions = categoriesWrapper.querySelectorAll('input[options]')
  /* Looping through the checkboxes, keep the ones that are checked and create 1 array for each language */
  Array.from(Array.from(checkboxesOptions).filter((checkbox) =>   checkbox.checked).map((check) => check.id.replace(/_/g, ' '))).map(function(item){
    const parts = item.split('-');
    options.push(parts[0])
    opciones.push(parts[1])
    })
  

  /* Get types */ 
  checkboxesTypes = categoriesWrapper.querySelectorAll('input[types]')
  /* Looping through the checkboxes, keep the ones that are checked and create 1 array for each language */
  Array.from(Array.from(checkboxesTypes).filter((checkbox) =>   checkbox.checked).map((check) => check.id.replace(/_/g, ' '))).map(function(item){
    const parts = item.split('-');
    types.push(parts[0].re)
    tipos.push(parts[1])
    })

  /* Get restaurant options */
    checkboxesDrinks = categoriesWrapper.querySelectorAll('input[drinks]')
    /* Looping through the checkboxes, keep the ones that are checked and create 1 array for each language */
    Array.from(Array.from(checkboxesDrinks).filter((checkbox) =>   checkbox.checked).map((check) => check.id.replace(/_/g, ' '))).map(function(item){
      const parts = item.split('-');
      drinks.push(parts[0])
      bebidas.push(parts[1])
      })

    checkboxesPayments = categoriesWrapper.querySelectorAll('input[payments]')
    /* Looping through the checkboxes, keep the ones that are checked and create 1 array for each language */
    Array.from(Array.from(checkboxesPayments).filter((checkbox) =>   checkbox.checked).map((check) => check.id.replace(/_/g, ' '))).map(function(item){
      const parts = item.split('-');
      payments.push(parts[0])
      pagos.push(parts[1])
      })

    checkboxesOthers = categoriesWrapper.querySelectorAll('input[others]')
    /* Looping through the checkboxes, keep the ones that are checked and create 1 array for each language */
    Array.from(Array.from(checkboxesOthers).filter((checkbox) =>   checkbox.checked).map((check) => check.id.replace(/_/g, ' '))).map(function(item){
      const parts = item.split('-');
      others.push(parts[0])
      otros.push(parts[1])
      })
    
  /* Get towns */
  townsWrapperAll = document.querySelectorAll('[townswrapper]')
  townsWrapper = document.querySelectorAll('[townswrapper]')[index]
  checkboxesTowns = townsWrapper.querySelectorAll('input[towns]')
  towns = Array.from(Array.from(checkboxesTowns).filter((checkbox) =>   checkbox.checked).map((check) => check.id.replace(/_/g, ' ')))
  
  /* If all the requiered field are filled */
  email = document.querySelectorAll('[createemail]')[index]
  names = document.querySelectorAll('[createname]')[index]
  nombre = document.querySelectorAll('[createnombre]')[index]
  who = document.querySelectorAll('[createwho]')[index]
  description = document.querySelectorAll('[createdescription]')[index]
  descripcion = document.querySelectorAll('[createdescripcion]')[index]
  const star = document.querySelectorAll('[datestart]')[index]
  const ends = document.querySelectorAll('[dateend]')[index]
  price = document.querySelectorAll('[createprice]')[index]

  if(names.value && nombre.value && who.value && description.value && descripcion.value && price.value && star.value && ends.value && towns.length !== 0 && (categories.length !== 0 || types.length !== 0 || options.length !== 0) && thumb && images.length !== 0 && (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) || email.value == "")){
  /* Selecting the right API ends */
  var type
  var start
  var end
  for (var i = 0; i < 5; i++) {
    if (index == 0) {
      type = "marketplace"
      categories.splice(3)
      categorias.splice(3)
      start = ""
      end = ""
      break;
    }
    if (index == 1) {
      type = "events"
      categories.splice(3)
      categorias.splice(3)
      /* Converting 12 hours format to 24 hours format for Xano */     
      const [time, modifier] = (document.querySelector('[hoursstart]').value + ":" + document.querySelector('[minutesstart]').value + " " + document.querySelector('[ampmstart]').value).split(" ");      
      let [hours, minutes] = time.split(":");       
      if (hours === "12") {
          hours = "00";
        }
       
      if (modifier === "PM") {
          hours = parseInt(hours, 10) + 12;
        }

        const [times, modifiers] = (document.querySelector('[hoursend]').value + ":" + document.querySelector('[minutesend]').value + " " + document.querySelector('[ampmend]').value).split(" ");      
      let [hourss, minutess] = times.split(":");       
      if (hourss === "12") {
          hourss = "00";
        }
       
      if (modifiers === "PM") {
          hourss = parseInt(hourss, 10) + 12;
        }

      start = star.value + " " + hours + ":" + minutes
      end = ends.value ? document.querySelectorAll('[dateend]')[index].value + " " + hourss + ":" + minutess : ""
      break;
    }
    if (index == 2) {
      type = "estates"
      start = star.value
      end = document.querySelectorAll('[dateend]')[index].value ? document.querySelectorAll('[dateend]')[index].value : ""
      break; 
    }
    if (index == 3) {
      type = "restaurants"
      start = ""
      end = ""
      break; 
    }
    if (index == 4) {
      type = "services"
      categories.splice(5)
      categorias.splice(5)
      start = ""
      end = ""
      break; 
    }    
  }

 /* categories.push("default") // add only to english array because it's used for filtration
  towns.push("default") 
  if(type == "marketplace" || type == "estates") options.push("default")
  if(type == "estates") types.push("default") 
  if(type == "restaurants") { drinks.push("default"); payments.push("default"); others.push("default") }*/

  var urlcreate = new URLSearchParams()
  urlcreate.append("name", names.value)
  urlcreate.append("nombre", nombre.value)
  if(document.querySelectorAll('[createphone]')[index].value)urlcreate.append("phone", document.querySelectorAll('[createphone]')[index].value)
  urlcreate.append("who", who.value)
  urlcreate.append("email", email.value ? email.value : userEmail)
  urlcreate.append("userid", id)
  if(document.querySelectorAll('[createmap]')[index].value)urlcreate.append("map", document.querySelectorAll('[createmap]')[index].value)
  if(document.querySelectorAll('[createvideo]')[index].value)urlcreate.append("video", document.querySelectorAll('[createvideo]')[index].value)
  if(document.querySelectorAll('[createwebsite]')[index].value)urlcreate.append("website", document.querySelectorAll('[createwebsite]')[index].value)
  urlcreate.append("description", description.value)
  urlcreate.append("descripcion", descripcion.value)
  urlcreate.append("thumbnail", thumb)
  if(plan == "premium") urlcreate.append("priority", 2)
  if(type == "events" || type == "estates"){
  urlcreate.append("start", start)
  urlcreate.append("price", price.value)
  if(end) urlcreate.append("end", end)
  }
  if(type == "restaurants"){
  if(document.querySelector('[createhours]').value) urlcreate.append("hours", document.querySelector('[createhours]').value)
  if(document.querySelector('[createdays]').value) urlcreate.append("days", document.querySelector('[createdays]').value)
  }
  if(type == "estates"){
  if(document.querySelector('[createbedrooms]').value) urlcreate.append("bedrooms", document.querySelector('[createbedrooms]').value)
  if(document.querySelector('[createbathrooms]').value) urlcreate.append("bathrooms", document.querySelector('[createbathrooms]').value)
  if(document.querySelector('[createplaces]').value) urlcreate.append("places", document.querySelector('[createplaces]').value)
  }
  if(type == "events") urlcreate.append("recurring", document.querySelector('[createrecurring]').value)
  images.forEach((value, index) => {
    urlcreate.append(`images[${index}]`, value);
  })
  categories.forEach((value, index) => {
    urlcreate.append(`categories[${index}]`, value);
  })   
  categorias.forEach((value, index) => {
    urlcreate.append(`categorias[${index}]`, value);
  })
  towns.forEach((value, index) => {
    urlcreate.append(`towns[${index}]`, value);
  })
  if(type == "marketplace" || type == "estates"){
  options.forEach((value, index) => {
    urlcreate.append(`options[${index}]`, value);
  })
  opciones.forEach((value, index) => {
    urlcreate.append(`opciones[${index}]`, value);
  })
  }
  if(type == "estates"){
  types.forEach((value, index) => {
    urlcreate.append(`types[${index}]`, value);
  })
  tipos.forEach((value, index) => {
    urlcreate.append(`tipos[${index}]`, value);
  })
  } 
  if(type == "restaurants"){
    drinks.forEach((value, index) => {
      urlcreate.append(`drinks[${index}]`, value);
    })
    bebidas.forEach((value, index) => {
      urlcreate.append(`bebidas[${index}]`, value);
    })
    payments.forEach((value, index) => {
      urlcreate.append(`payments[${index}]`, value);
    })
    pagos.forEach((value, index) => {
      urlcreate.append(`pagos[${index}]`, value);
    })
    others.forEach((value, index) => {
      urlcreate.append(`others[${index}]`, value);
    })
    otros.forEach((value, index) => {
      urlcreate.append(`otros[${index}]`, value);
    })
    }         

  createItem(index)

  async function createItem(index){
    try{
    const res = await fetch(URL + type,
    {
    method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Access-Control-Allow-Origin': '*'
      },
      body:urlcreate
    })
    console.log(res)
    if(res.status === 200){
      // Add new item on the page
     /* const data = await res.json()
      console.log(data)
      const itemTemplate = document.querySelectorAll('[item]')[0]
      const itemList = itemTemplate.parentElement
      const items = data.map(({name, thumbnail, id, type, status}) => {
      const item = itemTemplate.cloneNode(true)
      item.querySelector('[itemid]').textContent = id
      item.querySelector('[itemname]').textContent = name
      item.querySelector('[itemtype]').textContent = type
      item.querySelector('[thumb]').src = thumbnail.url
      if(plan == "premium") {
        if(status == "live") item.querySelector('[openarchive]').style.display = "block"; else item.querySelector('[openunarchive]').style.display = "block";
      }
      return item
      })
      console.log(items.length)
      itemList.append(...items)*/
      // Reset fields value
      document.querySelectorAll('[createName]')[index].value = ""
      document.querySelectorAll('[createnombre]')[index].value = ""
      document.querySelectorAll('[createphone]')[index].value = ""
      document.querySelectorAll('[createemail]')[index].value = ""
      document.querySelectorAll('[createwho]')[index].value = ""
      document.querySelectorAll('[createprice]')[index].value = ""
      document.querySelectorAll('[createwebsite]')[index].value = ""
      document.querySelectorAll('[createvideo]')[index].value = ""
      document.querySelectorAll('[createmap]')[index].value = ""
      document.querySelectorAll('[createdescription]')[index].value = ""
      document.querySelectorAll('[createdescripcion]')[index].value = ""
      document.querySelectorAll('[datestart]')[index].value = ""
      document.querySelectorAll('[dateend]')[index].value = ""
      const create = document.querySelectorAll('[createpopup]')[index]
      create.querySelectorAll('.checkbox_input').forEach(box => {
        box.nextElementSibling.checked = false
        box.classList.remove('w--redirected-checked')
      })
      document.querySelector('[createbedrooms]').value = ""
      document.querySelector('[createbathrooms]').value = ""
      document.querySelector('[createplaces]').value = ""
      document.querySelector('[createrecurring]').value = ""
      document.querySelector('[createdays]').value = ""
      document.querySelector('[createhours]').value = ""

      //Hide create popup and show success popup & trigger success lottie
      createPopups[index].classList.remove('show')
      images = []
      thumb = ""
      window.location.href = "#scrollTop"
      document.querySelectorAll('[input]').forEach(input => {  //Put back the labels of the fields
        input.nextElementSibling.classList.remove('active')
       })

      setTimeout(() => {
      document.querySelector('[successpopup]').classList.add('show')
      //document.querySelector('[successlottie]').click()
      }, 400)
      setTimeout(() => {
        document.querySelector('[successpopup]').classList.remove('show')
        }, 4000) 
      setTimeout(() => {
        document.querySelector('[popup]').classList.remove('show')
        }, 4500)  
    }
    } catch(error){
    console.log('error:', error);
    throw error;
    }
    }  
  } else {
    if(!names.value) names.classList.add('empty'); else names.classList.remove('empty')
    if(!nombre.value) nombre.classList.add('empty'); else nombre.classList.remove('empty')
    if(!who.value) who.classList.add('empty'); else who.classList.remove('empty')
    if(!price.value) price.classList.add('empty'); else price.classList.remove('empty')
    if(!description.value) description.classList.add('empty'); else description.classList.remove('empty')
    if(!descripcion.value) descripcion.classList.add('empty'); else descripcion.classList.remove('empty')
    if(!star.value) star.classList.add('empty'); else star.classList.remove('empty')
    if(!ends.value) ends.classList.add('empty'); else ends.classList.remove('empty')
    if(!thumb) document.querySelectorAll('[thumbheading]')[index].classList.add('empty'); else document.querySelectorAll('[thumbheading]')[index].classList.remove('empty')
    if(images.length === 0) document.querySelectorAll('[imageheading]')[index].classList.add('empty'); else document.querySelectorAll('[imageheading]')[index].classList.remove('empty')
    if(towns.length === 0) document.querySelectorAll('[townsheading]')[index].classList.add('empty'); else document.querySelectorAll('[townsheading]')[index].classList.remove('empty')
    if(categories.length === 0) document.querySelectorAll('[categoriesheading]')[index].classList.add('empty'); else document.querySelectorAll('[categoriesheading]')[index].classList.remove('empty') 
    document.querySelectorAll('[formmissingfielderror]')[index].classList.add('show')
    setTimeout(() => {
    document.querySelectorAll('[formmissingfielderror]')[index].classList.remove('show')
    }, 5000)
  }
  }) 
  })


  //Open delete account popup
  document.querySelector('[showdelecteaccountpopup]').addEventListener('click', () => {
    document.querySelector('[popup]').classList.add('show')
    setTimeout(() => {
    document.querySelector('[delecteaccountpopup]').classList.add('show')
    }, 300)
   })

   //Close delete account popup
  document.querySelector('[closedeleteaccountpopup]').addEventListener('click', () => {
    document.querySelector('[delecteaccountpopup]').classList.remove('show')
    setTimeout(() => {
    document.querySelector('[popup]').classList.remove('show')
    }, 300)
   })


   

/* Animation on input label */
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
