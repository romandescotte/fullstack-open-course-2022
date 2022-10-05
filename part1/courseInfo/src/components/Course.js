const Header = ({name}) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

const Content = ({course}) => {  
  return (
    <>      
      {
        course.parts.map(part=> 
          <Part part={part} key={part.id}/>)
      }      
    </>
  )
}

const Part = ({part}) => {  
  return (
    <>
      <p>{part.name}: {part.exercises} </p>
    </>
  )
}

const Course = ({course}) => {
  console.log({course}); 
  const total = course.parts
    .map(part => part.exercises)
    .reduce((prev, curr) => prev + curr);

  console.log(total);

  return (
    <>
      <Header name={course.name} />     
      <Content course={course} /> 
      <p><b>total of {total} exercises</b></p>
    </>
  )
}

export default Course