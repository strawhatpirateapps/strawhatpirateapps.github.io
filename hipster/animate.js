//handle input to dynamically change textContent; not necessary if hard-coding text
var input=document.body.querySelector('#text-input');

var entering = false;

var texts = document.body.querySelectorAll('.text');

function submit(){
  if (input.value.length < 1 || entering == true) return;
 for (var i =0; i<texts.length; i++){
   //randomize neon blinking letters
   if (texts[i].parentNode.classList.contains('neon')){
     texts[i].innerHTML='';
     for (var j = 0; j < input.value.length; j++){
       if (Math.random() > 0.8){
        texts[i].innerHTML += "<span class=\"blink\">"+input.value[j]+"</span>";
       }else{
        texts[i].innerHTML += input.value[j];
       }
     }
   }
   
   else{
     texts[i].firstChild.nodeValue = input.value;
   }
 }
 startAnimation();
}

function startAnimation(){
  entering = true;
  document.body.classList.add('enter');
  setTimeout(function(){
   entering = false; document.body.classList.remove('enter');
  },1500);
}

startAnimation();

