var date = new Date();
wochentag=new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag","Samstag");
let today = wochentag[date.getDay()];

let rows = document.getElementsByClassName("table-row")

console.log(rows[0])

function kommen() {
  let element = getChildByParentClass(today, "von")
  element.innerHTML = date.getHours() + ":" + date.getMinutes()
  synchronizeValues();
}

function gehen() {
  let element = getChildByParentClass(today, "bis")
  element.innerHTML = date.getHours() + ":" + date.getMinutes()
  synchronizeValues();
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
  let restzeit = "20:00"
  for (let i = 0; i < rows.length; i++) {
    let von = getChildByParent(rows[i], "von")
    let bis = getChildByParent(rows[i], "bis")
    if (von.innerHTML != "-" && bis.innerHTML != "-") {
      let ist = getChildByParent(rows[i], "ist")
      let pause = getChildByParent(rows[i], "pause")
      let ist_pause = getChildByParent(rows[i], "ist-pause")
      let rest = getChildByParent(rows[i], "restzeit")
      ist.innerHTML = calcDiff(von, bis)
      if (calcHours(von, bis) >= 6) {
        pause.innerHTML = "00:30"
      }
      if (calcHours(von, bis) >= 9) {
        pause.innerHTML = "00:45"
      }
      if (calcHours(von, bis) < 6) {
        pause.innerHTML = "00:00"
      }
      ist_pause.innerHTML = substractTime(ist.innerHTML, pause.innerHTML)
      if (ist_pause.innerHTML.split(":")[0] > restzeit.split(":")[0] && ist_pause.innerHTML.split(":")[1] > restzeit.split(":")[1]) {
        restzeit = "00:00"
      } else {
        restzeit = substractTime(restzeit, ist_pause.innerHTML)
      }
      rest.innerHTML = restzeit
    }
  }
}

function calcDiff(von, bis) {
  let h_diff = bis.innerHTML.split(":")[0] - von.innerHTML.split(":")[0]
  let m_diff = bis.innerHTML.split(":")[1] - von.innerHTML.split(":")[1]
  return formatNumber(h_diff) + ":" + formatNumber(m_diff)
}

function calcDiffString(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours < 0)
       hours = hours + 24;
    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}

function substractTime(time, time2) {
  var olddate = new Date(2022, 2, 22, time.split(":")[0], time.split(":")[1], 0, 0);
  var subbed = new Date(olddate - time2.split(":")[0]*60*60*1000 - time2.split(":")[1]*60*1000);
  var newtime = formatNumber(subbed.getHours()) + ':' + formatNumber(subbed.getMinutes());
  return newtime
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
}
