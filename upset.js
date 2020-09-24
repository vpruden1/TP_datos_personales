const plotUpset = (data, soloSets, plotId) => {
    // all sets
    const allSetNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substr(0, soloSets.length).split('');

    // position and dimensions
    const margin = {
      top: 100,
      right: 200,
      bottom: 300,
      left: 100,
    };
    const width = 40 * data.length;
    const height = 400;

    // make the canvas
    const svg = d3.select(`#${plotId}`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('class','plot')
      .append('g')
      .attr('transform',
        `translate(${margin.left},${margin.top})`);

    // make a group for the upset circle intersection things
    const upsetCircles = svg.append('g')
      .attr('id', 'upsetCircles')
      .attr('transform', `translate(20,${height + 40})`);

    const rad = 13;

    // making dataset labels
    soloSets.forEach((x, i) => {
      upsetCircles.append('text')
        .attr('dx', -30)
        .attr('dy', 5 + i * (rad * 2.7))
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        //Nombro una clase para el styling
        .attr('class','texto')
        .text(x.name);
    });

    // sort data decreasing
    data.sort((a, b) => parseFloat(b.num) - parseFloat(a.num));

    // make the bars
    const upsetBars = svg.append('g')
      .attr('id', 'upsetBars');

    const nums = data.map((x) => x.num);

    // set range for data by domain, and scale by range
    const xrange = d3.scaleLinear()
      .domain([0, nums.length])
      .range([0, width]);

    const yrange = d3.scaleLinear()
      .domain([0, d3.max(nums)])
      .range([height, 0]);

    // set axes for graph
    const xAxis = d3.axisBottom()
      .scale(xrange)
      .tickPadding(2)
      .tickFormat((d, i) => data[i].setName)
      .tickValues(d3.range(data.length));

    const yAxis = d3.axisLeft()
      .scale(yrange)
      .tickSize(5);

    // add X axis
    upsetBars.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .call(xAxis)
      .selectAll('.tick')
      .remove();


    // Add the Y Axis
    upsetBars.append('g')
      .attr('class', 'y axis')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .call(yAxis)
      .selectAll('text')
      .attr('class', 'texto')
      .attr('fill', 'black')
      .attr('stroke', 'none');


    const chart = upsetBars.append('g')
      .attr('transform', 'translate(1,0)')
      .attr('id', 'chart');

    // adding each bar
    const bars = chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('width', 20)
      .attr('x', (d, i) => 9 + i * (rad * 2.7))
      .attr('y', (d) => yrange(d.num))
      .style('fill','#7FC3CF')
      .attr('height', (d) => height - yrange(d.num));

    // circles
    data.forEach((x, i) => {
      allSetNames.forEach((y, j) => {
        upsetCircles.append('circle')
          .attr('cx', i * (rad * 2.7))
          .attr('cy', j * (rad * 2.7))
          .attr('r', rad)
          .attr('class', `set-${x.setName}`)
          .style('opacity', 1)
          .attr('fill', () => {
            if (x.setName.indexOf(y) !== -1) {
              return '#7FC3CF';
            }
            return '#D6C5B9';
          });
      });

      upsetCircles.append('line')
        .attr('id', `setline${i}`)
        .attr('x1', i * (rad * 2.7))
        .attr('y1', allSetNames.indexOf(x.setName[0]) * (rad * 2.7))
        .attr('x2', i * (rad * 2.7))
        .attr('y2', allSetNames.indexOf(x.setName[x.setName.length - 1]) * (rad * 2.7))
        .style('stroke', '#7FC3CF')
        .attr('stroke-width', 4);
    });

    // tooltip
    const tooltip = d3.select(`#${plotId}`)
      .append('div')
      .style('font-family','Courier New')
      .style('color', 'black')
      .style('background-color','#E9E9E9')
      .style('font-size','20px')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('padding', '0px 10px')
      .style('border-radius', '12px')
      .text('hehe'); // it changes, don't worry

    bars.on('mouseover', (d) => {
      tooltip.text(`${d.name}: ${d.num} persona${d.num === 1 ? '' : 's'}`).style('visibility', 'visible')
       ;
    })
      .on('mousemove', () => {
        tooltip.style('top', `${d3.event.pageY - 20}px`).style('left', `${d3.event.pageX + 20}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });
};


let carita = d3.select('#carita')
  .attr('transform', `translate(80,200`); 