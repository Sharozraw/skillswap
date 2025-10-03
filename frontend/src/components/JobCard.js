const JobCard = ({ job, onAccept }) => (
  <div className="bg-white shadow-md p-4 rounded-lg mb-4">
    <h3 className="font-bold">{job.title}</h3>
    <p>{job.description}</p>
    <p>Payment: {job.payment}</p>
    <p>Posted by: {job.postedBy.name}</p>
    {onAccept && <button onClick={() => onAccept(job._id)} className="bg-green-500 text-white px-4 py-2 mt-2">Accept</button>}
  </div>
);

export default JobCard;