export function Instructor({ instructors }) {
    if (!instructors || instructors.length === 0) return <p>Instructor TBA</p>;
  
    const instructorName = instructors[0]?.name;
    if (!instructorName) return <p>Instructor TBA</p>;
  
    const [lastName, firstName] = instructorName.split(", ");
    return <p>{firstName} {lastName}</p>;
  }
  