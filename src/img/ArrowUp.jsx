const ArrowUp = ({ onClick, arrowUpActive, arrowUpActiveInfo }) => (
  <svg
  style={{ fill: arrowUpActive || arrowUpActiveInfo ? 'purple' : 'grey', cursor: !arrowUpActiveInfo && !arrowUpActive ? 'default' : 'pointer', }}
  xmlns="http://www.w3.org/2000/svg" 
  className="arrowDown" 
  height="30"
  viewBox="0 -960 960 960" 
  onClick={onClick} 
  width="30"><path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
  </svg>
);

export default ArrowUp;