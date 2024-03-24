import panda from "../test_images/Panda.jpg";

const GameImagePreview = () => {
  return (
    <div className="container-fluid">
      <img
        src={panda}
        className="img-fluid flex-content rounded text-center"
      />
    </div> 
  );
};

export default GameImagePreview;
