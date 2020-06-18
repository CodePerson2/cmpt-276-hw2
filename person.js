// code for node-server
var namesList = ['name', 'size', 'height', 'shape', 'color', 'pet', 'petname', 'pettype'];
var arrLen = namesList.length;
var listCont = document.getElementById("info").innerHTML;

function fillList(list){
    var l = document.getElementById("info");
    document.getElementById("mid").innerHTML = "";
    l.innerHTML = "";
    l.innerHTML = listCont;
    for(var i = 0; i < list.length; i++){
        addToList(list[i]);
    }
}

function get(queryType, persArr) {
    var xhttp;
    var type;
    var loc = "/send/";
    if(queryType == 'insert' || queryType == 'update'){
        if(persArr[5] == 'inline-block') persArr[5] = 'yes';
        var person = [queryType, persArr[0], persArr[1], persArr[2], switchShape(persArr[3]), persArr[4], persArr[5], persArr[6], switchShape(persArr[7])];
    }
    switch(queryType){
        case 'select':
            type = 'GET';
            loc = "/users/"
            break;
        case 'insert':
            type = 'POST';
            break;
        case 'update':
            type = 'POST';
            person.push(persArr[8]);
            break;
        case 'delete':
            type = 'POST';
            var person = [queryType, persArr];
            break;
        default:
            break;
      }
    
    person = JSON.stringify(person);
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          switch(queryType){
            case 'select':
                var list = JSON.parse(this.responseText);
                fillList(list['rows']);
                break;
            case 'insert':
                var list = JSON.parse(this.responseText);
                let q = list['rows'];
                r = q[0];
                r = r['id'];
                changeSel(r, 'new', persArr[0], persArr[1], persArr[2], persArr[3], persArr[4], persArr[5], persArr[6], persArr[7]);
                
                break;
            case 'update':
                changeSel(persArr[8], 'new', persArr[0], persArr[1], persArr[2], persArr[3], persArr[4], persArr[5], persArr[6], persArr[7]);
                break;
            case 'delete':
                break;
            default:
                break;
          }
            
            
      }
    };
    xhttp.open(type, loc+person, true);
    xhttp.send();
}

var on = setInterval(function(){ getVal('sel'); }, 1000);

function checkRadio(radio){
  var len = radio.length;
  for (var i = 0; i < len; i++){
    if (radio[i].checked) {
      return radio[i].value;
    }
  }
}
function pickRadio(radio, val){
  var len = radio.length;
  for (var i = 0; i < len; i++){
    if (radio[i].value == val) {
      radio[i].checked = "checked";
    }
  }
}
function switchShape(shape){
  switch(shape){
    case '0%':
      return 'square';
    case '25%':
      return 'roundish';
    case '50%':
      return 'round';
    default:
      return null;
      
  }
}
function switchShape2(shape){
    switch(shape){
      case 'square':
        return '0%';
      case 'roundish':
        return '25%';
      case 'round':
        return '50%';
      default:
        return null;
        
    }
  }


function addVal(){
  getVal('new');
}

function getVal(pos, id = null){
  var name = document.getElementById("name");
  var size = document.getElementById("size");
  var height = document.getElementById("height");
  var shape = document.getElementsByName("shape");
  shape = checkRadio(shape);
  var color = document.getElementsByName("color");
  color = checkRadio(color);
  var pet = document.getElementsByName("pet")
  pet = checkRadio(pet);
  var petName = document.getElementById("petName");
  var petType = document.getElementsByName("petType");
  petType = checkRadio(petType);
  
  if(pos == 'new'){
    var arr = makeList(name.value, size.value, height.value, shape, color, pet, petName.value, petType);
    get('insert', arr);
    }

    else if(pos == 'up'){
        var arr = makeList(name.value, size.value, height.value, shape, color, pet, petName.value, petType, id);
        get('update', arr);
    }
    else changeSel( null, pos, name.value, size.value, height.value, shape, color, pet, petName.value, petType);
}

function changeSel(id = null, pos, name, size, height, shape, color, pet, petName = null, petType = null){
  if(pos == 'sel'){
    var selPerson = document.getElementById("selPerson");
    var selPet = document.getElementById("selPet");
  }
  else if(pos == 'new'){
    var selDiv = document.createElement("div")
    selDiv.classList.add("container")
    var selPerson = document.createElement("span");
    selPerson.classList.add("one");
    var selPet = document.createElement("span");
    selPet.classList.add("pet");
  }
  
  var nameL = "<label style='position: relative; top:-15px; font-size: 16px;'>" + name + "</label>";
  var petL = "<label style='position: relative; top:-15px; font-size: 16px;'>" + petName + "</label>";
  
  selPerson.innerHTML = nameL;
  selPerson.style.width = (50 + parseInt(size)) + 'px';
  selPerson.style.height = (70 + parseInt(height)) + 'px';
  selPerson.style.borderRadius = shape;
  selPerson.style.backgroundColor = color;
  
  if(pet == 'inline-block') var petOn = 'Yes';
  else if(pet == 'none') var petOn = 'No';
  selPerson.title = "Name: " + name + "\nSize: " + size + "\nHeight: " + height + "\nShape: " + switchShape(shape) + "\nColor: " + color + "\nPet: " + petOn + "\nPetName: " + petName + "\nPetType: " + switchShape(petType);
  
  
  selPet.style.display = pet;
  selPet.innerHTML = petL;
  selPet.style.borderRadius = petType;
  
  if(pos == "new"){
    var del = document.createElement("button");
    var up = document.createElement("button");
    del.innerText = 'X';
    up.innerText = 'U';
    del.classList.add("del");
    del.onclick = function(){deletePerson(id)}; //update id
    del.title = "Delete";
    del.style.top = '-30px';
    up.onclick = function(){updatePerson(id)}; //update id
    up.title = "Update";
    up.style.top = "-5px";
    up.classList.add("up");
    selDiv.id = id;                              //update id
    selDiv.appendChild(del);
    selDiv.appendChild(up);
    selDiv.appendChild(selPerson);
    selDiv.appendChild(selPet);


    var personlist = document.getElementById("mid");
    personlist.appendChild(selDiv);
    
  }
  //console.log(makeList(name, size, height, shape, color, pet, petName, petType));
  //var arr = ['hi', 50, 50, 'sq', 'red', 'yes', 'bob', 'round'];
  //addToList(arr);
  
}
function deletePerson(Id){
    get('delete', Id);
    document.getElementById(Id).outerHTML = "";
}
function updatePerson(Id){
  var div = document.getElementById(Id);
  div.style.display = 'none';
  
  var cont = div.childNodes;
  var person = cont[2];
  var pet = cont[3];
  var personLabel = (person.childNodes)[0];
  var petLabel = (pet.childNodes)[0];
  var personSize = parseInt(person.style.width);
  personSize = (personSize - 50);
  var personHeight = parseInt(person.style.height);
  personHeight = (personHeight - 70);
  var shape = person.style.borderRadius;
  var color = person.style.backgroundColor;
  var petDis = pet.style.display;
  var petType = pet.style.borderRadius;

  document.getElementById(Id).outerHTML = "";
  

  document.getElementById("name").value = personLabel.innerHTML;
  document.getElementById("size").value = personSize;
  document.getElementById("height").value = personHeight;
  pickRadio(document.getElementsByName("shape"), shape);
  pickRadio(document.getElementsByName("color"), color);
  pickRadio(document.getElementsByName("pet"), petDis);
  document.getElementById("petName").value = petLabel.innerHTML;
  pickRadio(document.getElementsByName("petType"), petType);
  document.getElementById("title").innerHTML = "Update Person";
  var subButton = document.getElementById("submitPerson");
  subButton.onclick = function(){update(Id)};
  subButton.innerHTML = "Update";
}
function update(Id){
  getVal('up', Id);
  document.getElementById("title").innerHTML = "Create Person";
  var subButton = document.getElementById("submitPerson");
  subButton.onclick = function(){addVal()};
  subButton.innerHTML = "Submit";
}

function addToList(personArr){
  var table = document.getElementById("info");
  var row = document.createElement("tr");
  for(var i = 0; i < arrLen; i++){
        var slot = document.createElement("td");
        slot.innerHTML = personArr[namesList[i]];
        row.appendChild(slot);
    
  }
  table.appendChild(row);
  addPerson(personArr);
}
function makeList(id = null, name, size, height, shape, color, pet, petName = null, petType = null){
  var persArr = Array();
  persArr.push(id);
  persArr.push(name);
  persArr.push(size);
  persArr.push(height);
  persArr.push(shape);
  persArr.push(color);
  persArr.push(pet);
  persArr.push(petName);
  persArr.push(petType);
  return persArr;
}
function addPerson(personArr){
    if(personArr['pet'] == 'yes') personArr['pet'] = 'inline-block';
    changeSel(personArr['id'], 'new', personArr['name'].trim(), personArr['size'], personArr['height'], switchShape2(personArr['shape'].trim()), personArr['color'], personArr['pet'], personArr['petname'].trim(), switchShape2(personArr['pettype'].trim()));

}