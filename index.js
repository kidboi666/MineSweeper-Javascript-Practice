var tbody = document.querySelector('#table tbody');
var dataset = [];
var flag = false;
var opened = 0;
var chordList = {
  openedBlank: -1,
  questionMark: -2,
  flags: -3,
  flagMine: -4,
  questionMine: -5,
  mines: 1,
  normalBlank: 0,
}
document.querySelector('#exec').addEventListener('click', function() {
  tbody.innerHTML = '';
  dataset = [];
  document.querySelector('#result').textContent = '';
  flag = false;
  opened = 0;
  var hor = parseInt(document.querySelector('#hor').value);
  var ver = parseInt(document.querySelector('#ver').value);
  var mine = parseInt(document.querySelector('#mine').value);
  console.log(hor, ver, mine);
  // 지뢰 위치 뽑기

  var numbers = Array(hor * ver)
    .fill()
    .map(function (element, index) {
      return index;
    });
  var shuffle = []; // 피셔예이츠 셔플

  while (numbers.length > hor * ver - mine) {
    var shuffleNumber = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
    shuffle.push(shuffleNumber);
  };
  // 지뢰 테이블 만들기
  console.log(shuffle);


  for (var i = 0; i < ver; i += 1) {
    var arr = [];
    var tr = document.createElement('tr');
    dataset.push(arr);
    for (var j = 0; j < hor; j += 1) {
      arr.push(chordList.normalBlank);
      var td = document.createElement('td');

      td.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        if (flag) {
          return;
        };
        var parentTr = e.currentTarget.parentNode;
        var parentTbody = e.currentTarget.parentNode.parentNode;
        var blank = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
        var line = Array.prototype.indexOf.call(parentTbody.children, parentTr);
        if (e.currentTarget.textContent === '' || e.currentTarget.textContent === 'X') {
          e.currentTarget.textContent = '!';
          if (dataset[line][blank] === chordList.mines) {
            dataset[line][blank] = chordList.flagMine;
          } else {
            dataset[line][blank] = chordList.flags;
          }
        } else if (e.currentTarget.textContent === '!') {
          e.currentTarget.textContent = '?';
          if (dataset[line][blank] === chordList.flagMine) {
            dataset[line][blank] = chordList.questionMine;
          } else {
            dataset[line][blank] = chordList.questionMark;
          }
        } else if (e.currentTarget.textContent === '?') {
          if (dataset[line][blank] === chordList.questionMine) {
            e.currentTarget.textContent = 'X';
          } else {
            e.currentTarget.textContent = '';
            dataset[line][blank] = chordList.normalBlank;
          }
        }
      })
      td.addEventListener('click', function(e) {
        if (flag) {
          return;
        };
        var parentTr = e.currentTarget.parentNode;
        var parentTbody = e.currentTarget.parentNode.parentNode;
        var blank = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
        var line = Array.prototype.indexOf.call(parentTbody.children, parentTr);
        if ([chordList.openedBlank, chordList.flags, chordList.flagMine, chordList.questionMine, chordList.questionMark].includes(dataset[line][blank])) {
          return;
        }
        e.currentTarget.classList.add('opened');
        opened += 1;
        if (dataset[line][blank] === chordList.mines) {
          e.currentTarget.textContent = '펑';
          document.querySelector('#result').textContent = '실패 ㅜㅜ';
          flag = true;
        } else { // 지뢰가 아닌 경우 주변 지뢰 갯수 세기
          var around = [
            dataset[line][blank-1], dataset[line][blank+1],
          ]
          if (dataset[line-1]) {
            around = around.concat([dataset[line-1][blank-1], dataset[line-1][blank], dataset[line-1][blank+1]])
          }
          if (dataset[line+1]) {
            around = around.concat([dataset[line+1][blank-1], dataset[line+1][blank], dataset[line+1][blank+1]])
          }
          var aroundMine = around.filter(function(v) {
            return [chordList.mines, chordList.flagMine, chordList.questionMine].includes(v);
          }).length;
          // 거짓인 값 : false, '', 0, null, undefined, NaN
          e.currentTarget.textContent = aroundMine || '';
          dataset[line][blank] = chordList.openedBlank;
          if (aroundMine === 0) {
            var aroundBlank = [];
            if (tbody.children[line-1]) {
              aroundBlank = aroundBlank.concat([
                tbody.children[line - 1].children[blank - 1],
                tbody.children[line - 1].children[blank],
                tbody.children[line - 1].children[blank + 1],
              ]);
            }
            aroundBlank = aroundBlank.concat([
              tbody.children[line].children[blank - 1],
              tbody.children[line].children[blank + 1],
            ]);

            if (tbody.children[line + 1]) {
              aroundBlank = aroundBlank.concat([
                tbody.children[line + 1].children[blank - 1],
                tbody.children[line + 1].children[blank],
                tbody.children[line + 1].children[blank + 1],
              ])
            }
            aroundBlank.filter(function (v) {
              return !!v;
            }).forEach(function(sideBlank) {
              var parentTr = sideBlank.parentNode;
              var parentTbody = sideBlank.parentNode.parentNode;
              var sideBlankBlank = Array.prototype.indexOf.call(parentTr.children, sideBlank);
              var sideBlankLine = Array.prototype.indexOf.call(parentTbody.children, parentTr);
              if (dataset[sideBlankLine][sideBlankBlank] !== chordList.openedBlank) {
                sideBlank.click();
              }
            });
          }
          console.log(opened, hor * ver - mine)
          if (opened === hor * ver - mine) {
            flag = true;
            document.querySelector('#result').textContent = '승리 ^^';
          }
        }
      });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  // 지뢰 심기
  for (var k = 0; k < shuffle.length; k++) { // 예 60
    var column = Math.floor(shuffle[k] / ver); // 예 7 -> 6
    var row = shuffle[k] % ver; // 예 0 -> 0
    console.log(column, row);
    tbody.children[column].children[row].textContent = 'X';
    dataset[column][row] = chordList.mines;
  }
});