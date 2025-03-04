const Course = ({ course }) => {
  return (
    <div>
      <CourseHeader name={course.name} />
      <Content parts={course.parts} />
      <Statistics parts={course.parts} />
    </div>
  )
}
  
const CourseHeader = ({ name }) => {
  return (
    <div>
      <h2>{name}</h2>
    </div>
  )
}
  
const Content = ({ parts }) => {
  return (
    parts.map(part =>
      <Part key={part.id} part={part}/>
    )
  )
}
  
const Part = ({ part }) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
const Statistics = ({ parts }) => {
  const initialValue = 0
  
  return (
    <strong>
      <p>
        total of {parts.reduce((sum, part) => {return sum + part.exercises}, initialValue)} exercises
      </p>
      </strong>
  )
}

export default Course