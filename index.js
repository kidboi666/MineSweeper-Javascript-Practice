var tbody = document.querySelector('#table tbody');
var dataset = [];

document.querySelector('#exec').addEventListener('click', function() {
  tbody.innerHTML = '';
  dataset = [];
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
  while (numbers.length > 80) {
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
      arr.push(1);
      var td = document.createElement('td');

      td.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        var parentTr = e.currentTarget.parentNode;
        var parentTbody = e.currentTarget.parentNode.parentNode;
        var blank = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
        var line = Array.prototype.indexOf.call(parentTbody.children, parentTr);
        if (e.currentTarget.textContent === '' || e.currentTarget.textContent === 'X') {
          e.currentTarget.textContent = '!';
        } else if (e.currentTarget.textContent === '!') {
          e.currentTarget.textContent = '?';
        } else if (e.currentTarget.textContent === '?') {
          if (dataset[line][blank] === 1) {
            e.currentTarget.textContent = '';
          } else if (dataset[line][blank] === 'X') {
            e.currentTarget.textContent = 'X';
          }
        }
      })
      td.addEventListener('click', function(e) {
        // 클릭했을때 주변 지뢰 개수
        var parentTr = e.currentTarget.parentNode;
        var parentTbody = e.currentTarget.parentNode.parentNode;
        var blank = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
        var line = Array.prototype.indexOf.call(parentTbody.children, parentTr);
        e.currentTarget.classList.add('opened');
        if (dataset[line][blank] === 'X') {
          e.currentTarget.textContent = '펑';
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
            return v === 'X';
          }).length;

          e.currentTarget.textContent = aroundMine;
          if (aroundMine === 0) {
            var aroundBlank = [];
            if (tbody.children[line-1]) {
              aroundBlank = aroundBlank.concat([
                tbody.children[line-1].children[blank-1],
                tbody.children[line-1].children[blank],
                tbody.children[line-1].children[blank+1],
              ]);
            }
            aroundBlank = aroundBlank.concat([
              tbody.children[line].children[blank-1],
              tbody.children[line].children[blank+1],
            ]);

            if (tbody.children[line+1]) {
              aroundBlank = aroundBlank.concat([
                tbody.children[line+1].children[blank-1],
                tbody.children[line+1].children[blank],
                tbody.children[line+1].children[blank+1],
              ])
            }
            dataset[line][blank] = 1;
            aroundBlank.filter(function (v) {
              return !!v;
            }).forEach(function(sideBlank) {
              var parentTr = sideBlank.parentNode;
              var parentTbody = sideBlank.parentNode.parentNode;
              var sideBlankBlank = Array.prototype.indexOf.call(parentTr.children, sideBlank);
              var sideBlankLine = Array.prototype.indexOf.call(parentTbody.children, parentTr);
              if (dataset[sideBlankLine][sideBlankBlank] !== 1) {
                sideBlank.click();
              }
            });
          }
        }
      });
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  // 지뢰 심기
  for (var k = 0; k < shuffle.length; k++) { // 예 60
    var column = Math.floor(shuffle[k] / 10); // 예 7 -> 6
    var row = shuffle[k] % 10; // 예 0 -> 0
    console.log(column, row);
    tbody.children[column].children[row].textContent = 'X';
    dataset[column][row] = 'X';
  }
});