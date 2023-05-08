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
 
/***** Side menus *****/
/* Menu for Side sections - FAQ, Rules & Tips */
$("#faq, #rule, #tip").click(function(){ 
  $('.dashboard_side-sections-wrapper').addClass('open');
  $('[closearrow]').addClass('open');
  $('[closearrow]').css('pointer-events', 'auto')
  })

/* Close Menu for Side sections */
$("[closearrow]").click(function(){ 
	$('.dashboard_side-sections-wrapper').removeClass('open');
  $('.dashboard_side-section').removeClass('open');
  $('[closearrow]').removeClass('open');
   $('[closearrow]').css('pointer-events', 'none')
  })
 
$("#faq").click(function(){
	$('.dashboard_side-section').not('.is--faq').removeClass('open')
	setTimeout(function() { 
    $('#faqs').addClass('open');
    }, 600);
  }) 
  
$("#rule").click(function(){
	$('.dashboard_side-section').not('.is--rules').removeClass('open')
	setTimeout(function() { 
    $('#rules').addClass('open');
    }, 600);
  }) 
  
  $("#tip").click(function(){
	$('.dashboard_side-section').not('.is--tips').removeClass('open')
	setTimeout(function() { 
    $('#tips').addClass('open');
    }, 600);
  }) 
 
 
setTimeout(function(){
const alertWrappers = document.querySelectorAll('[dashboard_alert-wrapper]')
const alertBody = document.querySelectorAll('[dashboard_alert-body]')  
const deletes = document.querySelectorAll('[deleteit]')
const deleteitem = document.querySelectorAll('[delete-item]') 
const closes = document.querySelectorAll('[closeAlert]')
console.log(alertWrappers)
console.log(alertBody)


 deletes.forEach((alert, index) => {
alert.addEventListener('click', () => {
 alertWrappers[index].classList.add('open')
 alertBody[index].classList.add('open')
 deleteitem[index].style.display = "block"
 setTimeout(function(){
 alertBody[index].classList.add('open')
 }, 300)
 setTimeout(function(){
 closes[index].classList.add('open')
 }, 100)
 }) 
})


deleteitem.forEach((alert, index) => {
alert.addEventListener('click', () => {
	setTimeout(function(){
  location.reload();
  }, 100)
 }) 
})

closes.forEach((close, index) => {
close.addEventListener('click', () => {
  alertWrappers[index].classList.remove('open');
  alertBody[index].classList.remove('open');
  })
})
}, 8000);
