//передаем в функцию список смежности, стартовую вершину, и вершину - окончание
let app = function(routes, S, T) {
    let adj = makeAdj(routes); //создаем ребра
    let output;
    attachStations(routes, adj);//для
    let visited = new Set(); //создаем массив посещенных/непосещенных вершин
    let current = { station : S, depth : 0, prev : null};//константа на первую вершину
    let queue = [current]; //создали очередь, положили в нее первую вершину
    let eventQueue = [];
    visited.add(S); //пометили вершину посещенной
    let per = [];
    while(queue.length > 0) { //пока очередь не пуста

        current = queue.shift(); //извлекаем элемент из очереди
        per.push(current.station)
        eventQueue.push(current); //рассматриваем этот элемент
        if (current.station === T) { output = current.depth; break; } // если вершина последняя-- то выход
        for (let i = 0; i < adj[current.station].length; i++) { //для всех смежных вершин
            let bus = adj[current.station][i]; //создали константу - различные маршруту из каррент в и
            for (let j = 0; j < routes[bus].length; j++) {
                if (!visited.has(routes[bus][j])) {//если вершина не посещена
                    //то кладем ее вочередь //routes - маршруты
                    queue.push({ station : routes[adj[current.station][i]][j], depth : current.depth + 1, prev : current.station });
                    //и помечаем как пройденную
                    visited.add(routes[adj[current.station][i]][j]);
                }
            }
        }
    }

    let theElement = document.getElementById('block');
    theElement.innerHTML = "1" + "  ";
  for (let i = 1; i < per.length; i++) {
       theElement.innerHTML += per[i] + "  ";
      ;
  }
    output = output || -1;

    function taskRunner() {
        if (eventQueue.length === 0) { return; }
        let current = eventQueue.shift();
        promisify(current).then((result) => {
            taskRunner();
        });
    }

    function promisify(element) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let edgeId = `${Math.min(element.prev, element.station)}-${Math.max(element.prev, element.station)}`
                let station = document.getElementById(element.station);
                let edge = document.getElementById(edgeId);
                station.style.backgroundColor = '#FE9C9C';
                if (edge) {
                    edge.style.stroke = `black`;
                }
                setTimeout(() => {
                    if (edge) {
                        edge.style.stroke = `#CB5959`;
                    }
                    resolve();
                }, 1050);
            }, 1050);
        });
    }
    taskRunner();
};

let attachStations = function(routes, adj) { //создаем связи для вершин сначала связываем их в структуре, потом рисуем ребра
    let map = document.getElementById('map'); //обращаемся к div
    let keys = Object.keys(adj); //возвращает массив из собственных перечисляемых свойств переданного объекта
    let max = Math.max(...keys);//находим максимальный среди них
    keys.forEach((station) => {
        let currentStation = document.createElement('div');
        currentStation.classList.add('station');
        currentStation.id = station;
        currentStation.style.left = `${((station - 1)/max) * 700 + 15}px`;
        currentStation.style.top = `${Math.random() * 540 + 15}px`;
        currentStation.textContent = station;
        map.appendChild(currentStation);
    })
    connectEdges(routes); //рисуем ребра
};

let connectEdges = function(routes) { //функция для прорисовки ребер
    let map = document.getElementById('map');
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = 'svg';
    map.appendChild(svg);
    for (let bus = 0; bus < routes.length; bus++) {
        for (let stationI = 0; stationI < routes[bus].length; stationI++) {
            for (let stationJ = stationI + 1; stationJ < routes[bus].length; stationJ++) {

                let I = document.getElementById(routes[bus][stationI]);
                let J = document.getElementById(routes[bus][stationJ]);
                let x1 = Number(I.style.left.substring(0, I.style.left.length - 2));
                let x2 = Number(J.style.left.substring(0, J.style.left.length - 2));
                let y1 = Number(I.style.top.substring(0, I.style.top.length - 2));
                let y2 = Number(J.style.top.substring(0, J.style.top.length - 2));
                let edge = document.createElementNS("http://www.w3.org/2000/svg", "line")
                edge.setAttribute('x1', `${x1 + 5}px`);
                edge.setAttribute('x2', `${x2 + 5}px`);
                edge.setAttribute('y1', `${y1 + 5}px`);
                edge.setAttribute('y2', `${y2 + 5}px`);
                edge.id = `${Math.min(routes[bus][stationI], routes[bus][stationJ])}-${Math.max(routes[bus][stationI], 
                    routes[bus][stationJ])}`;
                console.log(edge.id)
                svg.appendChild(edge);
                edge.classList.add('edge');
            }
        }
    }
};

let makeAdj = function(routes) {
    let adj = {};
    for (let bus = 0; bus < routes.length; bus++) {

        for (let station = 0; station < routes[bus].length; station++) {
            if (!adj[routes[bus][station]]) {
                adj[routes[bus][station]] = [];
            }
            adj[routes[bus][station]].push(bus);
        }
    }
    return adj;
};

url = 'https://api.myjson.com/bins/nk9xc'
app($.ajax({
    url: url,
    dataType: 'json',
    success: function(recievedJson) {
        app(recievedJson.routes, 1, 7);
    }
}));


//app([[1, 2, 3, 4], [2, 10], [3, 8, 9, 5], [4, 5, 6], [5, 7], [6, 7]],1, 7)