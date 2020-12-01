document.querySelector('#exec').addEventListener('click', function() {
  var hor = parseInt(document.querySelector('#hor').value);
  var ver = parseInt(document.querySelector('#ver').value);
  var mine = parseInt(document.querySelector('#mine').value);

  var dataset = []; // 큰 틀인 빈배열 만들고
  var tbody = document.querySelector('#table tbody') // tbody를 선택하고
  for (i = 0; i < ver; i++) { // ver 입력값 만큼 반복문을 실행하고
    var arr = []; // 빈 배열 arr 변수를 선언하고
    var tr = document.createElement('tr'); // tr 요소를 만드는 변수를 선언
    dataset.push(arr); // 만든 빈 배열 arr를 dataset에 푸쉬
    for (j = 0; j < hor; j++) { // hor 입력값 만큼 반복문을 실행하고
      arr.push(1); // arr에 1을 푸쉬
      var td = document.createElement('td'); // td요소를 만드는 변수 선언
      tr.appendChild(td); // 변수 td를 변수 tr의 자식 요소로 등록
    }
    table.appendChild(tr); // 변수 tr를 변수 table의 자식 요소로 등록
  }
  console.log(dataset); // 콘솔로그로 dataset 출력
})