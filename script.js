var date = new Date();
wochentag = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag","Samstag");
let today = wochentag[date.getDay()];

let rows = document.getElementsByClassName("table-row")

loadData()

function kommen() {
  let element = getChildByParentClass(today, "von")
  element.innerHTML = date.getHours() + ":" + date.getMinutes()
  synchronizeValues();
  saveData()
}

function gehen() {
  let element = getChildByParentClass(today, "bis")
  element.innerHTML = date.getHours() + ":" + date.getMinutes()
  synchronizeValues();
  saveData()
}

function getChildByParentClass(parentclass, childclass) {
  let parent = document.getElementsByClassName(parentclass)[0];
  let children = parent.childNodes
  for (let i = 0; i < children.length; i++) {
    if (children[i].className == childclass) {
      return children[i]
    }
  }
}

function getChildByParent(parent, childclass) {
  let children = parent.childNodes
  for (let i = 0; i < children.length; i++) {
    if (children[i].className == childclass) {
      return children[i]
    }
  }
}

function synchronizeValues() {
  let restzeit = localStorage.getItem('goal');
  if (restzeit == null) {
    restzeit = "20:00"
    localStorage.setItem('goal', restzeit);
  }
  for (let i = 0; i < rows.length; i++) {
    let von = getChildByParent(rows[i], "von")
    let bis = getChildByParent(rows[i], "bis")
    if (von.innerHTML != "-" && bis.innerHTML != "-") {
      let ist = getChildByParent(rows[i], "ist")
      let pause = getChildByParent(rows[i], "pause")
      let ist_pause = getChildByParent(rows[i], "ist-pause")
      let rest = getChildByParent(rows[i], "restzeit")
      ist.innerHTML = calcRestTime(von.innerHTML, bis.innerHTML)
      if (calcHours(von, bis) >= 6) {
        pause.innerHTML = "00:30"
      }
      if (calcHours(von, bis) >= 9) {
        pause.innerHTML = "00:45"
      }
      if (calcHours(von, bis) < 6) {
        pause.innerHTML = "00:00"
      }
      ist_pause.innerHTML = calcRestTime(pause.innerHTML, ist.innerHTML)
      console.log(ist_pause.innerHTML.split(":")[0] >= restzeit.split(":")[0]);
      console.log(ist_pause.innerHTML.split(":")[1] >= restzeit.split(":")[1]);
      if (ist_pause.innerHTML.split(":")[0] > restzeit.split(":")[0]) {
          restzeit = "00:00"
      } else {
        restzeit = calcRestTime(ist_pause.innerHTML, restzeit)
      }
      rest.innerHTML = restzeit
    }
  }
}


function calcRestTime(time1, time2) {
  ist_h = time1.split(":")[0]
  ist_m = time1.split(":")[1]
  rest_h = time2.split(":")[0]
  rest_m = time2.split(":")[1]
  diff_h = rest_h - ist_h
  diff_m = rest_m - ist_m
  if (diff_m < 0) {
    diff_m += 60
    diff_h -= 1
  }
  if (diff_h < 0) {
    return "00:00"
  }
  return formatNumber(diff_h) + ":" + formatNumber(diff_m)
}

function calcHours(von, bis) {
  let h_diff = bis.innerHTML.split(":")[0] - von.innerHTML.split(":")[0]
  return h_diff
}

function formatNumber(num) {
  if (num < 10) {
    num = "0" + num
  }
  return num
}

function addTime() {
  let i_von = document.getElementById("input-von").value
  let i_bis = document.getElementById("input-bis").value
  let tag = document.getElementById("tag")
  tag = tag.options[tag.selectedIndex].value
  let von = getChildByParentClass(tag, "von")
  let bis = getChildByParentClass(tag, "bis")
  von.innerHTML = i_von
  bis.innerHTML = i_bis
  synchronizeValues()
  saveData()
}

function setGoal() {
  let goal = document.getElementById("input-goal").value
  localStorage.setItem('goal', goal);
  synchronizeValues()
}


function resetStorage() {
  localStorage.clear();
  location.reload();
}

function saveData() {
  let data = []
  for (let i = 0; i < rows.length; i++) {
    let von = getChildByParent(rows[i], "von").innerHTML
    let bis = getChildByParent(rows[i], "bis").innerHTML
    let day = []
    day.push(von)
    day.push(bis)
    data.push(day)
  }
  localStorage.setItem('data', JSON.stringify(data));
}

function loadData() {
  let savedGoal = localStorage.getItem('goal');
  if (savedGoal == null) savedGoal = "20:00"
  document.getElementById("input-goal").value = savedGoal

  let data = JSON.parse(localStorage.getItem("data"))
  if (data == null) return
  console.log(data);
  for (let i = 0; i < rows.length; i++) {
    let von = getChildByParent(rows[i], "von").innerHTML = data[i][0]
    let bis = getChildByParent(rows[i], "bis").innerHTML = data[i][1]
  }
  synchronizeValues()
}
