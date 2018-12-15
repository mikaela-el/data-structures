// load data file
d3.json('DDdata.json')
.then((data) => {
  d3.select('body').selectAll('.day')  
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'day')
    .attr('style', (d) => {
        return "background-image: url(" + d.photo.S + ")"
    })
    .append("h2")
    .html('Title')
});